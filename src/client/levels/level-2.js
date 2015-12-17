
import THREE from 'three';
import Level from './level';
import Board from '../components/board';


export default () => {
  let level = new Level();

  level.add(new THREE.AmbientLight(0xffffff));

  let lights = new THREE.Object3D();

  var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
  pointLight.position.set( -15, -15, 5 );
  lights.add( pointLight );

  var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
  pointLight.position.set( 15, 15, 5 );
  lights.add( pointLight );

  var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
  pointLight.position.set( -15, 15, 5 );
  lights.add( pointLight );

  var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
  pointLight.position.set( 15, -15, 5 );
  lights.add( pointLight );

  var light = new THREE.DirectionalLight(0xffffff, 5);
  light.position.set(0, 100, 10);
  light.lookAt(0, -100, -10);
  lights.add(light);

  level.add(lights);

  level.update(delta => {
    lights.rotateZ(Math.PI * 2 * delta / 10);
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
    this.board = new Board(4, 10);

    checkGroups(this, 20);
  });

  level.stage(function () {
    this.board = new Board(10, 4);
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
