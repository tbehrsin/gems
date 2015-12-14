uniform vec3 uAmbientColor;
uniform vec3 uDiffuseColor;
uniform vec3 uSpecularColor;
uniform float uShininess;
uniform float uOpacity;

uniform bool enableDiffuse1;
uniform bool enableDiffuse2;
uniform bool enableSpecular;

uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;
uniform sampler2D tDetail;
uniform sampler2D tNormal;
uniform sampler2D tSpecular;
uniform sampler2D tDisplacement;

uniform float uNormalScale;

uniform vec2 uRepeatOverlay;
uniform vec2 uRepeatBase;

uniform vec2 uOffset;

varying vec3 vTangent;
varying vec3 vBinormal;
varying vec3 vNormal;
varying vec2 vUv;

uniform vec3 ambientLightColor;

#if MAX_DIR_LIGHTS > 0
  uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];
	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];
#endif

#if MAX_POINT_LIGHTS > 0
  uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];
	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];
	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];
#endif

varying vec3 vViewPosition;

#ifdef USE_FOG
  uniform vec3 fogColor;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear;
    uniform float fogFar;
  #endif
#endif

void main() {
  gl_FragColor = vec4( vec3( 1.0 ), uOpacity );

	vec3 specularTex = vec3( 1.0 );

	vec2 uvOverlay = uRepeatOverlay * vUv + uOffset;
	vec2 uvBase = uRepeatBase * vUv;

	vec3 normalTex = texture2D( tDetail, uvOverlay ).xyz * 2.0 - 1.0;
	normalTex.xy *= uNormalScale;
	normalTex = normalize( normalTex );

	if( enableDiffuse1 && enableDiffuse2 ) {
		vec4 colDiffuse1 = texture2D( tDiffuse1, uvOverlay );
	  vec4 colDiffuse2 = texture2D( tDiffuse2, uvOverlay );

		#ifdef GAMMA_INPUT
      colDiffuse1.xyz *= colDiffuse1.xyz;
      colDiffuse2.xyz *= colDiffuse2.xyz;

		#endif

		gl_FragColor = gl_FragColor * mix ( colDiffuse1, colDiffuse2, 1.0 - texture2D( tDisplacement, uvBase ) );
	} else if( enableDiffuse1 ) {
    gl_FragColor = gl_FragColor * texture2D( tDiffuse1, uvOverlay );
  } else if( enableDiffuse2 ) {
    gl_FragColor = gl_FragColor * texture2D( tDiffuse2, uvOverlay );
  }

	if( enableSpecular ) specularTex = texture2D( tSpecular, uvOverlay ).xyz;

	mat3 tsb = mat3( vTangent, vBinormal, vNormal );
	vec3 finalNormal = tsb * normalTex;

	vec3 normal = normalize( finalNormal );
  vec3 viewPosition = normalize( vViewPosition );

	// point lights

	#if MAX_POINT_LIGHTS > 0
    vec3 pointDiffuse = vec3( 0.0 );
		vec3 pointSpecular = vec3( 0.0 );

		for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {
      vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );

      vec3 lVector = lPosition.xyz + vViewPosition.xyz;

			float lDistance = 1.0;

			if ( pointLightDistance[ i ] > 0.0 )
			  lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );

			lVector = normalize( lVector );

			vec3 pointHalfVector = normalize( lVector + viewPosition );
			float pointDistance = lDistance;

			float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );
			float pointDiffuseWeight = max( dot( normal, lVector ), 0.0 );

			float pointSpecularWeight = specularTex.r * pow( pointDotNormalHalf, uShininess );

			pointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;
			pointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * pointSpecularWeight * pointDiffuseWeight;

		}

  #endif

	// directional lights
  #if MAX_DIR_LIGHTS > 0
    vec3 dirDiffuse = vec3( 0.0 );
		vec3 dirSpecular = vec3( 0.0 );

	  for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {

			vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );

			vec3 dirVector = normalize( lDirection.xyz );
			vec3 dirHalfVector = normalize( lDirection.xyz + viewPosition );

			float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );
      float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );

			float dirSpecularWeight = specularTex.r * pow( dirDotNormalHalf, uShininess );

			dirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;
      dirSpecular += directionalLightColor[ i ] * uSpecularColor * dirSpecularWeight * dirDiffuseWeight;
	  }
  #endif

  // all lights contribution summation

	vec3 totalDiffuse = vec3( 0.0 );
	vec3 totalSpecular = vec3( 0.0 );

  #if MAX_DIR_LIGHTS > 0
    totalDiffuse += dirDiffuse;
    totalSpecular += dirSpecular;
  #endif

  #if MAX_POINT_LIGHTS > 0
    totalDiffuse += pointDiffuse;
    totalSpecular += pointSpecular;

	#endif

  gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor + totalSpecular );

  #ifdef GAMMA_OUTPUT
    gl_FragColor.xyz = sqrt( gl_FragColor.xyz );
  #endif

  #ifdef USE_FOG
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    #ifdef FOG_EXP2
      const float LOG2 = 1.442695;
      float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
      fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );
    #else
      float fogFactor = smoothstep( fogNear, fogFar, depth );
    #endif
    gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
  #endif
}
