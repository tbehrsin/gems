
import $3 from 'three';
import THREE from 'three';
import CanvasRenderer from 'three'

import Grass from '../images/graddlight-big.jpg'

import './application.less';

import Board from './board';
import Tween from '../tween';
import Levels from '../levels';

/*let body = document.querySelector('body');
if('onmousedown' in window) {
  var eventTargets = [window];
} else if('onmousedown' in body) {
  var eventTargets = [body];
} else {
  var eventTargets = [document.documentElement];
}*/

export default class Application {
  static start(window, selector) {
    let container = window.document.querySelector(selector);
    let application = new Application(window);
    container.appendChild(application.renderer.domElement);
    application.animate();
    return application;
  }

  constructor(window) {
    this.tween = new Tween();
    this.clock = new THREE.Clock();
    this.window = window;

    this.targetList = [];



    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 2, 10000);

    window.onresize = () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    };

    this.camera.position.y = 0;
    this.camera.position.z = 30;

    this.scene = new THREE.Scene();


   /* var skyBoxGeometry = new $3.CubeGeometry( 10000, 10000, 10000 );
    var skyBoxMaterial = new $3.MeshBasicMaterial( { color: 0, side: $3.BackSide } );
    var skyBox = new $3.Mesh( skyBoxGeometry, skyBoxMaterial );
    this.scene.add(skyBox);*/

    //this.scene.add(SkyBox.LostValley);



    this.levels = Levels;
    this.levels.camera = this.camera;
    this.scene.add(this.levels);

  }

  animate() {

    /*if(this.terrain) {
     var ray = new $3.Raycaster(new $3.Vector3(this.camera.position.x, 1000, this.camera.position.z), new $3.Vector3(0, -1, 0));
     var intersections = ray.intersectObjects([this.terrain.mesh]);
     if (intersections.length > 0) {
     let position = intersections[0].object.geometry.vertices[intersections[0].face.a];
     this.camera.position.y = position.y + 20;

     }
     }*/


    requestAnimationFrame(this.animate.bind(this));
    var delta = this.clock.getDelta();
    this.update(delta);
    this.render(this.renderer, this.scene, this.camera);
  }

  update(delta) {
    this.camera.updateProjectionMatrix();

    this.levels.update(delta);
    //this.boards.forEach(board => board.update(delta));
  }

  render(renderer, scene, camera) {

    this.levels.render(renderer, scene, camera);
    this.renderer.render(scene, camera);
  }
}

