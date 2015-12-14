
import THREE from 'three';
import FresnelShader from '../../shaders/fresnel';
import GlowShader from '../../shaders/glow';
import Tween from '../../tween';

import ParticleTexture from '../../images/particle.png';
let _ParticleTexture = THREE.ImageUtils.loadTexture(
  ParticleTexture
);

export default class Gem extends THREE.Mesh {

  constructor(geometry, material) {
    super(geometry, material);

    let glowMaterial =  new THREE.ShaderMaterial({
      uniforms: {
        "c": {type: "f", value: 0.15},
        "p": {type: "f", value: 4},
        glowColor: {type: "c", value: new THREE.Color(1,1,1,0.5)},
        viewVector: {type: "v3", value: new THREE.Vector3(0,0,0)}
      },
      vertexShader: GlowShader.vertexShader,
      fragmentShader: GlowShader.fragmentShader,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    this.glow = new THREE.Mesh(geometry, glowMaterial);
    this.glow.scale.multiplyScalar(1.05);
    this.glow.translateY(-0.025);
    this.glow.visible = false;
    this.add(this.glow);

    this.tween = new Tween();
    this.destroyed = false;
  }

  render(renderer, scene, camera) {

  }

  update(delta) {
    this.tween.update(delta);
  }

  destroy(tween, next) {
    // create the particle variables
    var particleCount = 2500,
      particles = new THREE.Geometry(),
      pMaterial = new THREE.PointsMaterial({
        color: this.material.color,
        size: 0.3,
        map: _ParticleTexture,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

      // create a particle with random
      // position values, -250 -> 250
      var pX = 0,
        pY = 0,
        pZ = 0,
        particle = new THREE.Vector3(pX, pY, pZ);
      particle.velocity = new THREE.Vector3(
        Math.random() * 2 - 1,              // x
        Math.random() * 3 - 1, // y: random vel
        Math.random() * 3 - 1.5);
      particle.velocity.normalize().multiplyScalar(Math.random() * 3);
      // add it to the geometry
      particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.Points(
      particles,
      pMaterial);
    //particleSystem.sortParticles = true;

    // add it to the scene
    particleSystem.position.copy(this.position);
    this.parent.add(particleSystem);

    let lastT = 0;
    tween.add('linear', 500, (t) => {
      this.scale.x = this.scale.y = this.scale.z = 1 - t;

      this.rotation.y = t * Math.PI * 2;
      var pCount = particleCount;

      while (pCount--) {

        // get the particle
        var particle =
          particles.vertices[pCount];

        // check if we need to reset
       /* if (particle.length(this.position) > 10) {
          particle.copy(this.position);
          particle.velocity.x = Math.random() * 3 - 1.5;
          particle.velocity.y = Math.random() * 3 - 1.5;
          particle.velocity.z = Math.random() * 3 - 1.5;
        }*/

        // update the velocity with
        // a splat of randomniz
        particle.velocity.x += Math.random() * .1 - 0.05;
        particle.velocity.y += Math.random() * .1 - 0.05;
        particle.velocity.z += Math.random() * .1 - 0.05;
        particle.addScaledVector(new THREE.Vector3(0, -1, 0), (t - lastT));

        particle.addScaledVector(particle.velocity, (t - lastT));
      }

      // flag to the particle system
      // that we've changed its vertices.
      particleSystem.
        geometry.
        verticesNeedUpdate = true;

      this.material.opacity = 1 - t;
      lastT = t;
    }, () => {
      next();
      var lastT = 0;

      tween.add('linear', 500, (t) => {
        var pCount = particleCount;

        while (pCount--) {

          // get the particle
          var particle =
            particles.vertices[pCount];

          // check if we need to reset
          //particle.velocity.multiplyScalar(0.9);

          // and the position
          particle.velocity.x += Math.random() * .1 - 0.05;
          particle.velocity.y += Math.random() * .1 - 0.05;
          particle.velocity.z += Math.random() * .1 - 0.05;
          particle.addScaledVector(particle.velocity, (t - lastT));
          particle.addScaledVector(new THREE.Vector3(0, -1, 0), 10 * (t - lastT));
        }

        // flag to the particle system
        // that we've changed its vertices.
        particleSystem.geometry.verticesNeedUpdate = true;
        particleSystem.material.opacity = 1 - t;
        lastT = t;
      }, () => {

        particleSystem.parent.remove(particleSystem);
      });
    });
  }

  onMouseEnter() {
    //this.fresnelUniforms.vBaseColor.value = new THREE.Vector4(1,1,1,1);
    this.glow.visible = true;
  }

  onMouseLeave() {
    //this.fresnelUniforms.vBaseColor.value = this.tint;
    this.glow.visible = false;
  }


}
