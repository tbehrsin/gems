
import DeepSpaceLeft from '../images/deep-space-1.jpg';
import DeepSpaceRight from '../images/deep-space-2.jpg';
import DeepSpaceTop from '../images/deep-space-3.jpg';
import DeepSpaceFront from '../images/deep-space-4.jpg';
import DeepSpaceBack from '../images/deep-space-5.jpg';
import DeepSpaceBottom from '../images/deep-space-6.jpg';

import CrystalDropFall from '../sounds/music-crystal-drop-fall.mp3';
import YellowGasGiant from '../images/gas-giant-yellow.jpg';
import Europa from '../images/Moon.jpg';
import EuropaBump from '../images/Moon2-Bump.jpg';
import GlowShader from '../shaders/glow';

loadTextures({
  SkyBox: [
    DeepSpaceRight,
    DeepSpaceLeft,
    DeepSpaceTop,
    DeepSpaceBottom,
    DeepSpaceFront,
    DeepSpaceBack
  ],
  YellowGasGiant: YellowGasGiant,
  Europa: Europa,
  EuropaBump: EuropaBump
});

loadMusic({
  CrystalDropFall: CrystalDropFall
});

level(0, function() {

  let stopPlaying = false;
  let audio = music.CrystalDropFall;
  audio.addEventListener('ended', () => {
    if(!stopPlaying) audio.play();
  });
  audio.play();

  this.addEventListener('destroy', () => {
    this.tween.add('ease-in-out', 2500, (t) => {
      audio.volume = 1 - t;
    }, () => {
      stopPlaying = true;
      audio.stop();
    });
  });

  let checkGroups = (self, maxGroups) => {
    let groups = 0;

    setTimeout(() => {
      self.progress.min = 0;
      self.progress.max = maxGroups;
      self.progress.value = 0;
      self.progress.text = maxGroups + ' TO GO';
    }, 0);

    self.board.addEventListener('destroy', (evt) => {
      groups++;
      if(groups < maxGroups) {
        self.progress.text = (maxGroups - groups) + ' TO GO';
      } else {
        self.progress.text = 'COMPLETE';
      }

      self.progress.value = Math.min(groups, maxGroups);
      this.score.addScore(evt.group);
      if(groups >= maxGroups) self.board.addEventListener('validated', (evt) => {
        this.next();
      });
    });
  };

  this.scene(function(THREE) {


    this.add(new THREE.AmbientLight(0xaaaaaa, 4));

    var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
    pointLight.position.set( -15, -15, 5 );
    this.lights.add( pointLight );

    var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
    pointLight.position.set( 15, 15, 5 );
    this.lights.add( pointLight );

    var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
    pointLight.position.set( -15, 15, 5 );
    this.lights.add( pointLight );

    var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
    pointLight.position.set( 15, -15, 5 );
    this.lights.add( pointLight );

    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(10, 10, 20);
    light.lookAt(-10, 10, -20);
    this.add(light);

    var spotLight = new THREE.SpotLight( 0xffffff, 10, 100, Math.PI/2 );
    spotLight.position.set( 0, 10, 10 );
    spotLight.lookAt(0, 0, -40);
    this.add(spotLight);

    this.skyBox = textures.SkyBox;

    let plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 4, 4), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BothSides}));
    plane.position.set(0, 0, 40);
    this.add(plane);

    plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 4, 4), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BothSides}));
    plane.position.set(0, 0, 40);
    plane.rotateY(Math.PI/3);
    this.add(plane);

    plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 4, 4), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BothSides}));
    plane.position.set(0, 0, 40);
    plane.rotateY(-Math.PI/3);
    this.add(plane);

    let g_planet1 = new THREE.SphereGeometry(500, 128, 128);
    let m_planet1 = new THREE.MeshPhongMaterial({ color: 0xffff00, specular: 0x444444, shininess: 10, map: textures.YellowGasGiant });
    let planet1 = new THREE.Mesh(g_planet1, m_planet1);
    planet1.position.set(-500, -250, -500);
    this.add(planet1);

    let glowMaterial1 =  new THREE.ShaderMaterial({
      uniforms: {
        c: {type: "f", value: 0.0001},
        p: {type: "f", value: 3},
        glowColor: {type: "c", value: new THREE.Color(0xffaa00)},
        viewVector: {type: "v3", value: new THREE.Vector3(1,1,-1).normalize()}
      },
      vertexShader: GlowShader.vertexShader,
      fragmentShader: GlowShader.fragmentShader,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    let glow_planet1 = new THREE.Mesh(g_planet1, glowMaterial1);
    glow_planet1.scale.multiplyScalar(1.05);
    this.add(glow_planet1);


    let g_planet2 = new THREE.SphereGeometry(70, 128, 128);
    let m_planet2 = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x444444, map: textures.Europa, shininess: 0.5, bumpMap: textures.EuropaBump, bumpScale: 0.5 });
    let planet2 = new THREE.Mesh(g_planet2, m_planet2);
    planet2.position.set(-50, -70, -200);
    this.add(planet2);

    let glowMaterial2 =  new THREE.ShaderMaterial({
      uniforms: {
        c: {type: "f", value: 0.0005},
        p: {type: "f", value: 10},
        glowColor: {type: "c", value: new THREE.Color(0xffffff)},
        viewVector: {type: "v3", value: new THREE.Vector3(1,1,-1).normalize()}
      },
      vertexShader: GlowShader.vertexShader,
      fragmentShader: GlowShader.fragmentShader,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    let glow_planet2 = new THREE.Mesh(g_planet2, glowMaterial2);
    glow_planet2.scale.multiplyScalar(1.05);
    this.add(glow_planet2);

    let rotation = -Math.PI / 4;
    this.update = (delta) => {
      planet1.rotateZ(Math.PI / 18);
      planet1.rotateY(delta * Math.PI / 360);
      planet1.rotateZ(-Math.PI / 18);

      rotation += delta * Math.PI / 360;
      planet2.position.set(-500 + 600 * Math.cos(rotation), -70, -500 + 600 * Math.sin(rotation));
      planet2.rotateZ(-Math.PI / 18);
      planet2.rotateY(delta * Math.PI / 360);
      planet2.rotateZ(Math.PI / 18);

      glow_planet1.position.copy(planet1.position);
      glowMaterial1.uniforms.viewVector.value = planet1.position.clone();
      glowMaterial1.uniforms.viewVector.value.z *= -1;
      glowMaterial1.uniforms.viewVector.value.normalize();
      glow_planet2.position.copy(planet2.position);
      glowMaterial2.uniforms.viewVector.value = planet2.position.clone();
      glowMaterial2.uniforms.viewVector.value.z *= -1;
      glowMaterial2.uniforms.viewVector.value.normalize();

      this.lights.rotateZ(Math.PI * 2 * delta / 10);
    };

    this.update(0);

    this.fog = new THREE.Fog( new THREE.Color(16/255,20/255,31/255), 250, 550 );
  });


  this.stage(function () {
    let nextTiles = [
      GlassNugget,   GreenGem,    BlueGem,   YellowGem,
      PurpleGem, GreenGem,    YellowGem, PurpleGem,
      PurpleGem, GreenDiamond,  GreenGem,    PurpleGem,
      YellowGem, YellowGem, GreenDiamond,  GreenGem
    ];

    this.board = new Board(4, 4, () => new (nextTiles.shift() || NextGem()));

    checkGroups(this, 5);
  });

  this.stage(function () {
    this.board = new Board(5, 5, () => new (NextGemOrDiamond()));

    checkGroups(this, 10);
  });

  this.stage(function () {
    let nextTiles = [
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
      PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond,
      CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond,
    ];


    this.board = new Board(6, 6, () => new (nextTiles.shift() || NextGemDiamondOrNugget()));

    checkGroups(this, 15);
  });

  this.stage(function () {
    this.board = new Board(7, 7, () => new (NextGemOrDiamond()));

    checkGroups(this, 20);
  });

  this.stage(function () {
    this.board = new Board(8, 8, () => new (NextGemOrDiamond()));

    checkGroups(this, 30);
  });

  this.stage(function () {
    this.board = new Board(9, 9, () => new (NextGemOrDiamond()));

    checkGroups(this, 50);
  });

  this.stage(function () {
    this.board = new Board(10, 10, () => new (NextGemDiamondOrNugget()));

    checkGroups(this, 25);
  });

});
