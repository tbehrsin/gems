uniform samplerCube tCube;

varying vec3 vViewPosition;

void main() {
  vec3 wPos = cameraPosition - vViewPosition;
  gl_FragColor = textureCube( tCube, vec3( - wPos.x, wPos.yz ) );
}
