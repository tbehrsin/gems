
import THREE from 'three';
import Level from './level';
import Board from '../components/board';

import { NextGem, NextGemOrDiamond, NextGemDiamondOrNugget, BlueGem, YellowGem, RedGem, PurpleGem, GreenDiamond } from '../components/tiles';


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
    let nextTiles = [
      BlueGem,   RedGem,    BlueGem,   YellowGem,
      PurpleGem, RedGem,    YellowGem, PurpleGem,
      PurpleGem, GreenDiamond,  RedGem,    PurpleGem,
      YellowGem, YellowGem, GreenDiamond,  RedGem
    ];

    this.board = new Board(4, 4, () => new (nextTiles.shift() || NextGem()));

    this.groups = 0;

    this.board.addEventListener('destroy', (evt) => {
      this.groups++;
      level.score.addScore(evt.group);
      if(this.groups >= 5) this.board.addEventListener('validated', (evt) => {
        level.next();
      });
    });
  });

  level.stage(function () {
    this.board = new Board(5, 5, () => new (NextGemOrDiamond()));

    this.groups = 0;

    this.board.addEventListener('destroy', (evt) => {
      this.groups++;
      level.score.addScore(evt.group);
      if(this.groups >= 10) this.board.addEventListener('validated', (evt) => {
        level.next();
      });
    });
  });

  level.stage(function () {
    this.board = new Board(6, 6, () => new (NextGemOrDiamond()));

    this.groups = 0;

    this.board.addEventListener('destroy', (evt) => {
      this.groups++;
      level.score.addScore(evt.group);
      if(this.groups >= 15) this.board.addEventListener('validated', (evt) => {
        level.next();
      });
    });
  });

  level.stage(function () {
    this.board = new Board(7, 7, () => new (NextGemOrDiamond()));

    this.groups = 0;

    this.board.addEventListener('destroy', (evt) => {
      this.groups++;
      level.score.addScore(evt.group);
      if(this.groups >= 20) this.board.addEventListener('validated', (evt) => {
        level.next();
      });
    });
  });

  level.stage(function () {
    this.board = new Board(8, 8, () => new (NextGemOrDiamond()));

    this.groups = 0;

    this.board.addEventListener('destroy', (evt) => {
      this.groups++;
      level.score.addScore(evt.group);
      if(this.groups >= 30) this.board.addEventListener('validated', (evt) => {
        level.next();
      });
    });
  });

  level.stage(function () {
    this.board = new Board(9, 9, () => new (NextGemOrDiamond()));

    this.groups = 0;

    this.board.addEventListener('destroy', (evt) => {
      this.groups++;
      level.score.addScore(evt.group);
      if(this.groups >= 50) this.board.addEventListener('validated', (evt) => {
        level.next();
      });
    });
  });

  level.stage(function () {
    this.board = new Board(10, 10, () => new (NextGemDiamondOrNugget()));

    this.groups = 0;
    this.board.addEventListener('destroy', (evt) => {
      this.groups++;
      level.score.addScore(evt.group);
      if(this.groups >= 25) this.board.addEventListener('validated', (evt) => {
        level.next();
      });
    });
  });

  return level;
};
