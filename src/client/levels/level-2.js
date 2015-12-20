
import THREE from 'three';
import Level from './level';
import Board from '../components/board';
import SkyBox from '../components/skybox';
import Stucci from '../images/stucci.json';
import Rock from '../images/rock.jpg';
import RockBump from '../images/rock-bump.jpg';
import GemBump from '../images/11376-bump.jpg';
import LyvoVice from '../sounds/music-lyvo-vice.mp3';
import { GlassNugget } from '../components/tiles';

export default (tween) => {

  let audio = new Audio(LyvoVice);
  audio.play();

  let StucciGeometry = new THREE.JSONLoader().parse(Stucci).geometry;
  let StucciMap = new THREE.ImageUtils.loadTexture(Rock);
  let StucciBumpMap = new THREE.ImageUtils.loadTexture(RockBump);
  StucciMap.wrapS = StucciMap.wrapT = THREE.MirroredRepeatWrapping;
  StucciMap.repeat.set( 10, 10 );
  StucciBumpMap.wrapS = StucciBumpMap.wrapT = THREE.MirroredRepeatWrapping;
  StucciBumpMap.repeat.set( 10, 10 );

  let level = new Level(tween);

  level.add(new THREE.AmbientLight(0x444444));

  let lights = new THREE.Object3D();

  var pointLight = new THREE.PointLight( 0xff0000, 1, 50 );
  pointLight.position.set( -15, -15, 5 );
  lights.add( pointLight );

  var pointLight = new THREE.PointLight( 0x00ff00, 1, 50);
  pointLight.position.set( 15, 15, 5 );
  lights.add( pointLight );

  var pointLight = new THREE.PointLight( 0x0000ff, 1, 50);
  pointLight.position.set( -15, 15, 5 );
  lights.add( pointLight );

  var pointLight = new THREE.PointLight( 0xff00ff, 1, 50);
  pointLight.position.set( 15, -15, 5 );
  lights.add( pointLight );

  var light = new THREE.DirectionalLight(0xaaaaaa, 1);
  light.position.set(0, 20, 10);
  light.lookAt(0, -20, -10);
  lights.add(light);

  level.add(lights);

  level.update(delta => {
    lights.rotateZ(Math.PI * 2 * delta / 10);
  });

  level.addEventListener('destroy', () => {
    level.tween.add('ease-in-out', 2500, (t) => {
      audio.volume = 1 - t;
    }, () => {
      audio.stop();
    });
  });

  level.scene(function() {

    this.add(new SkyBox([Rock,Rock,Rock,Rock,Rock,Rock]));

    let plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 4, 4), new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BothSides}));
    plane.position.set(0, 0, 40);
    this.add(plane);

    plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 4, 4), new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BothSides}));
    plane.position.set(0, 0, 40);
    plane.rotateY(Math.PI/3);
    this.add(plane);

    plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 4, 4), new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.BothSides}));
    plane.position.set(0, 0, 40);
    plane.rotateY(-Math.PI/3);
    this.add(plane);


    let stucciMaterial = new THREE.MeshPhongMaterial({
      map: StucciMap,
      diffuse: new THREE.Color(0xffffff),
      specular: new THREE.Color(0x111111),
      emissive: new THREE.Color(0x000000),
      bumpMap: StucciBumpMap,
      bumpScale: 1,
      shininess: 1,
      side: THREE.BackSide
    });

    let stucci = new THREE.Mesh(StucciGeometry, stucciMaterial);
    stucci.scale.set(50, 50, 50);
    this.add(stucci);

    let n = 10;
    for(var i = 0; i < n; i++) {
      for(var j = 0; j < n; j++) {

        let r = 0.7 + Math.random() * 0.2 - 0.1;
        var s = i + Math.random() * 0.25 - 0.125;
        var t = j + Math.random() * 0.25 - 0.125;

        let mesh = new GlassNugget();
        mesh.scale.set(0.5 / 50, 0.5 / 50, 0.5 / 50);
        mesh.position.set(r * Math.cos(s * Math.PI * 2 / n) * Math.sin(t * Math.PI / n), r * Math.sin(s * Math.PI * 2 / n) * Math.sin(t * Math.PI / n), r * Math.cos(t * Math.PI / n));
        mesh.lookAt(0, 0, 0);
        stucci.add(mesh);
      }
    }

    this.update = (delta) => {
      stucci.rotateZ(delta * Math.PI / 270);
      stucci.rotateY(delta * Math.PI / 360);
      stucci.rotateX(delta * Math.PI / 312.5);
    };

    this.update(90);
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
      level.score.addScore(evt.group);
      if(groups >= maxGroups) self.board.addEventListener('validated', (evt) => {
        level.next();
      });
    });
  };



  level.stage(function () {
    this.board = new Board(10, 10);

    checkGroups(this, 20);
  });

  level.stage(function () {
    this.board = new Board(10, 10);
    checkGroups(this, 20);
  });

  level.stage(function () {
    this.board = new Board(6, 6);
    checkGroups(this, 20);
  });

  level.stage(function () {
    this.board = new Board(7, 7);
    checkGroups(this, 30);
  });

  level.stage(function () {
    this.board = new Board(3, 3);

    checkGroups(this, 3);
  });

  level.stage(function () {
    this.board = new Board(9, 9);
    checkGroups(this, 81);
  });

  level.stage(function () {
    this.board = new Board(10, 10);
    checkGroups(this, 200);
  });

  return level;
};
