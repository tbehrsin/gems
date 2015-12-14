
import $3 from 'three';
import THREE from 'three';
import CanvasRenderer from 'three'

import Grass from '../images/graddlight-big.jpg'

import './application.less';
import TextGeometry from './text';

import Board from './board';
import SkyBox from './skybox';
import Tween from '../tween';


let Key = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}

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



    this.renderer = new $3.WebGLRenderer({ alpha: true });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new $3.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 2, 1000);
    this.camera.position.y = 0;
    this.camera.position.z = 30;

    this.scene = new $3.Scene();



   /* var skyBoxGeometry = new $3.CubeGeometry( 10000, 10000, 10000 );
    var skyBoxMaterial = new $3.MeshBasicMaterial( { color: 0, side: $3.BackSide } );
    var skyBox = new $3.Mesh( skyBoxGeometry, skyBoxMaterial );
    this.scene.add(skyBox);*/

    this.scene.add(SkyBox.LostValley);

    this.scene.add(new THREE.AmbientLight(0xffffff));

    this.lights = new THREE.Object3D();

    var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
    pointLight.position.set( -15, -15, 5 );
    this.lights.add( pointLight );

    var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
    pointLight.position.set( 15, 15, 5 );
    this.lights.add( pointLight );

    var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
    pointLight.position.set( -15, 15, 5 );
    this.lights.add( pointLight );
1
    var pointLight = new THREE.PointLight( 0xffffff, 1, 50 );
    pointLight.position.set( 15, -15, 5 );
    this.lights.add( pointLight );


    var light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(0, 100, 10);
    light.lookAt(0, -100, -10);
    this.lights.add(light);

    this.scene.add(this.lights);
    this.scene.add(this.board = new Board());


    window.addEventListener('touchstart', (evt) => {
      evt.preventDefault();
      window.dispatchEvent(new MouseEvent('mousedown', { clientX: evt.touches[0].clientX, clientY: evt.touches[0].clientY }));
    });

    window.addEventListener('touchmove', (evt) => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: evt.touches[0].clientX, clientY: evt.touches[0].clientY }));
    });

    window.addEventListener('touchend', (evt) => {
      window.dispatchEvent(new MouseEvent('mouseup', { }));
    })


    window.addEventListener('resize', (evt) => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.animate();
    }, false);

    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);

    this.keys = Object.keys(Key).map((v) => { return false; });

    window.addEventListener('keydown', (evt) => {
      switch(evt.which) {
        case 37: this.keys[Key.LEFT] = true; break;
        case 38: this.keys[Key.UP] = true; break;
        case 38: this.keys[Key.UP] = true; break;
        case 39: this.keys[Key.RIGHT] = true; break;
        case 40: this.keys[Key.DOWN] = true; break;
      }

    });

    window.addEventListener('keyup', (evt) => {
      switch(evt.which) {
        case 37: this.keys[Key.LEFT] = false; break;
        case 38: this.keys[Key.UP] = false; break;
        case 39: this.keys[Key.RIGHT] = false; break;
        case 40: this.keys[Key.DOWN] = false; break;
      }
    });

    this.score = 0;

    var scoreParams = {
      size: 1,
      height: 0.3,
      font: 'helvetiker',
      weight: 'bold',
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1
    };
    var scoreGeometry = new TextGeometry(this.score.toString(), scoreParams);
    var scoreMaterial = new THREE.MeshPhongMaterial({ color:  new THREE.Color("#663300"), shininess: 100, specular: new THREE.Color('#aaaa00') });
    var scoreMesh = new THREE.Mesh(scoreGeometry, scoreMaterial);
    let box = new THREE.Box3().setFromObject(scoreMesh);
    scoreMesh.position.x = -11-(box.max.x - box.min.x);
    scoreMesh.position.y = 7;
    this.scene.add(scoreMesh);
    this.multiplier = 1;
    this.scoreEvents = {};


    this.board.addEventListener('destroy', (evt) => {


      if(evt.group.length > 5) this.score += evt.group.length * 127 * this.multiplier;
      else this.score += evt.group.length * 31 * this.multiplier;

      if(this.score > 100000) {
        let slot = (Math.log10(this.score) | 0).toString();
        if (!(slot in this.scoreEvents)) {
          this.scoreEvents[slot] = true;
          setTimeout(function() {
            _gs('event', 'Scored ' + Math.pow(10, slot));
          }, 0);
        }
      }



      if(this.multiplier < 32) {
        this.multiplier *= 2;
        setTimeout(() => this.multiplier /= 2, 2500);
      }

      scoreGeometry = new TextGeometry(this.score.toString(), scoreParams);
      scoreMesh.geometry = scoreGeometry;

      let box = new THREE.Box3().setFromObject(scoreMesh);
      scoreMesh.position.x = -11 -(box.max.x - box.min.x);
      scoreMesh.position.y = 7;

    });
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
    if(this.keys[Key.LEFT]) this.camera.rotateY(25 * delta * Math.PI/180);
    if(this.keys[Key.RIGHT]) this.camera.rotateY(- 25 * delta * Math.PI/180);
    if(this.keys[Key.UP]) this.camera.translateZ(- 25 * delta);
    if(this.keys[Key.DOWN]) this.camera.translateZ( 25 * delta);

    this.camera.updateProjectionMatrix();

    this.lights.rotateZ(Math.PI * 2 * delta / 10);
    this.tween.update(delta);
    this.board.update(delta);
  }

  render(renderer, scene, camera) {
    this.board.render(renderer, scene, camera);
    this.renderer.render(scene, camera);
  }

  onMouseMove = (evt) => {
    let mouse = {
      x: (evt.clientX / window.innerWidth) * 2 - 1,
      y:  -(evt.clientY / window.innerHeight) * 2 + 1
    };

    var v = new $3.Vector3(mouse.x, mouse.y, 1);
    v.unproject(this.camera);
    var ray = new $3.Raycaster(this.camera.position, v.sub(this.camera.position).normalize() );

    // create an array containing all objects in the scene with which the ray intersects
    var intersections = ray.intersectObjects(this.gems);

    var hoverGems = intersections.map(gem => gem.object);
    if(this.previousHoverGems) {
      this.previousHoverGems.forEach(gem => {
        if(hoverGems.indexOf(gem) === -1) gem.onMouseLeave();
      });
    }
    hoverGems.forEach(gem => {
      if(this.previousHoverGems && this.previousHoverGems.indexOf(gem) === -1) {
        gem.onMouseEnter();
      }
    });
    this.previousHoverGems = hoverGems;
  };

  onMouseDown = (evt) => {
    let mouse = {
      x: (evt.clientX / window.innerWidth) * 2 - 1,
      y:  -(evt.clientY / window.innerHeight) * 2 + 1
    };
    let startGem = this.board.hitTest(this.camera, mouse.x, mouse.y);
    if(!startGem) return;

    let gemCoords = new THREE.Vector3(startGem.position.x, startGem.position.y, 0);

    var tweening = this.tween.add('ease-in-out', 150, (delta) => {
      startGem.position.z = delta;
    }, () => {

    });

    let onmousemove = (evt) => {
      let mouseMove = {
        x: (evt.clientX / window.innerWidth) * 2 - 1,
        y:  -(evt.clientY / window.innerHeight) * 2 + 1
      };

      let sx = Math.sign(mouseMove.x - mouse.x);
      let sy = Math.sign(mouseMove.y - mouse.y);

      var v1 = new THREE.Vector3(mouse.x, 0, 1);
      v1.unproject(this.camera);
      var v2 = new THREE.Vector3(mouseMove.x, 0, 1);
      v2.unproject(this.camera);

      var v3 = new THREE.Vector3(0, mouse.y, 1);
      v3.unproject(this.camera);
      var v4 = new THREE.Vector3(0, mouseMove.y, 1);
      v4.unproject(this.camera);

      let oppx = v2.distanceTo(v1);
      let adjx = this.camera.position.distanceTo(new THREE.Vector3(gemCoords.x + sx, gemCoords.y, 0));
      let oppy = v4.distanceTo(v3);
      let adjy = this.camera.position.distanceTo(new THREE.Vector3(gemCoords.x, gemCoords.y + sy, 0));

      let tx = Math.min(Math.PI, Math.max(0, oppx / adjx));
      let ty = Math.min(Math.PI, Math.max(0, oppy / adjy));

      this.board.swapQueue.add(startGem, sx, tx, sy, ty);
    };

    let onmouseup = (evt) => {
      window.removeEventListener('mousemove', onmousemove, false);
      window.removeEventListener('mouseup', onmouseup, false);

      this.board.swapQueue.complete(() => {
        tweening.remove();
        tweening = this.tween.add('ease-in-out', 150, (delta) => {
          startGem.position.z = 1 - delta;
        }, () => {

        });
      });
    };

    window.addEventListener('mousemove', onmousemove, false);
    window.addEventListener('mouseup', onmouseup, false);

  };
}
