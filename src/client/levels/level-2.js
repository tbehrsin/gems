
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





  level.stage(function () {
    this.board = new Board(4, 4);
  });

  level.stage(function () {
    this.board = new Board(5, 5);
  });

  level.stage(function () {
    this.board = new Board(6, 6);
  });

  level.stage(function () {
    this.board = new Board(7, 7);
  });

  level.stage(function () {
    this.board = new Board(8, 8);
  });

  level.stage(function () {
    this.board = new Board(9, 9);
  });

  level.stage(function () {
    this.board = new Board(10, 10);
  });

  return level;
};
