
import Stucci from '../images/stucci.json';
import Rock from '../images/rock.jpg';
import RockCube from '../images/rock-cube.jpg';
import RockBump from '../images/rock-bump.jpg';
import GemBump from '../images/11376-bump.jpg';
import LyvoVice from '../sounds/music-lyvo-vice.mp3';

loadTextures({
  RockCube: [RockCube,RockCube,RockCube,RockCube,RockCube,RockCube],
  Rock: Rock,
  RockBump: RockBump,
  GemBump: GemBump
});

loadMusic({
  LyvoVice: LyvoVice
});

level(1, function() {

  let stopPlaying = false;
  let audio = music.LyvoVice;
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

  this.scene(function(THREE) {



    let StucciGeometry = new THREE.JSONLoader().parse(Stucci).geometry;
    let StucciMap = textures.Rock;
    let StucciBumpMap = textures.RockBump;
    StucciMap.wrapS = StucciMap.wrapT = THREE.MirroredRepeatWrapping;
    StucciMap.repeat.set( 10, 10 );
    StucciBumpMap.wrapS = StucciBumpMap.wrapT = THREE.MirroredRepeatWrapping;
    StucciBumpMap.repeat.set( 10, 10 );

    this.skyBox = textures.RockCube;

    this.add(new THREE.AmbientLight(0x444444, 4));

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
    spotLight.position.set( 0, 10, 100 );
    spotLight.lookAt(0, 0, -40);
    this.add(spotLight);

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
      this.lights.rotateZ(Math.PI * 2 * delta / 10);
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
      this.score.addScore(evt.group);
      if(groups >= maxGroups) self.board.addEventListener('validated', (evt) => {
        this.next();
      });
    });
  };



  this.stage(function () {
    this.board = new Board(10, 10);

    checkGroups(this, 20);
  });

  this.stage(function () {
    this.board = new Board(10, 10);
    checkGroups(this, 20);
  });

  this.stage(function () {
    this.board = new Board(6, 6);
    checkGroups(this, 20);
  });

  this.stage(function () {
    this.board = new Board(7, 7);
    checkGroups(this, 30);
  });

  this.stage(function () {
    this.board = new Board(3, 3);

    checkGroups(this, 3);
  });

  this.stage(function () {
    this.board = new Board(9, 9);
    checkGroups(this, 81);
  });

  this.stage(function () {
    this.board = new Board(10, 10);
    checkGroups(this, 200);
  });
});
