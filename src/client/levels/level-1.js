
import THREE from 'three';
import Level from './level';
import Board from '../components/board';
import CrystalDropFall from '../sounds/music-crystal-drop-fall.mp3';
import { NextGem, NextTiles, NextGemOrDiamond, NextGemDiamondOrNugget, GlassNugget, PinkDiamond, CyanDiamond, BlueGem, YellowGem, RedGem, PurpleGem, GreenDiamond } from '../components/tiles';


export default () => {

  let audio = new Audio(CrystalDropFall);
  audio.play();

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
    let nextTiles = [
      GlassNugget,   RedGem,    BlueGem,   YellowGem,
      PurpleGem, RedGem,    YellowGem, PurpleGem,
      PurpleGem, GreenDiamond,  RedGem,    PurpleGem,
      YellowGem, YellowGem, GreenDiamond,  RedGem
    ];

    this.board = new Board(4, 4, () => new (nextTiles.shift() || NextGem()));

    checkGroups(this, 5);
  });

  level.stage(function () {
    this.board = new Board(5, 5, () => new (NextGemOrDiamond()));

    checkGroups(this, 10);
  });

  level.stage(function () {
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

  level.stage(function () {
    this.board = new Board(7, 7, () => new (NextGemOrDiamond()));

    checkGroups(this, 20);
  });

  level.stage(function () {
    this.board = new Board(8, 8, () => new (NextGemOrDiamond()));

    checkGroups(this, 30);
  });

  level.stage(function () {
    this.board = new Board(9, 9, () => new (NextGemOrDiamond()));

    checkGroups(this, 50);
  });

  level.stage(function () {
    this.board = new Board(10, 10, () => new (NextGemDiamondOrNugget()));

    checkGroups(this, 25);
  });

  return level;
};
