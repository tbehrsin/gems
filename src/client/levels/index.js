
import THREE from 'three';
import Score from './score';
import TextGeometry from '../components/text';
import Tween from '../tween';
import Level from './level';
import ProgressBar from '../components/progress';
var tiles = require('../components/tiles');
import Board from '../components/board';

export default new class Levels extends THREE.Object3D {
  constructor() {
    super();

    this.tween = new Tween();
    this.score = new Score(0);
    this.add(this.score);

    this.levelIndex = -1;
    this.levelCount = 2;
    this.levels = [];

    this.load(0, () => {
      window.Loader.hide();
      this.next();
    });

    window.addEventListener('touchstart', (evt) => {
      if(evt.target.nodeName === 'BUTTON') return evt.target.dispatchEvent(new MouseEvent('click'));
      var el = evt.target;
      while(el && el.parentNode) {
        if(el.className === 'ddd123-global_wrapper') {
          return evt.target.dispatchEvent(new MouseEvent('click'));
        }
        el = el.parentNode;
      }

      evt.preventDefault();
      window.dispatchEvent(new MouseEvent('mousedown', { clientX: evt.touches[0].clientX, clientY: evt.touches[0].clientY }));
    });

    window.addEventListener('touchmove', (evt) => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: evt.touches[0].clientX, clientY: evt.touches[0].clientY }));
    });

    window.addEventListener('touchend', (evt) => {
      window.dispatchEvent(new MouseEvent('mouseup', { }));
    })

    window.addEventListener('mousedown', (evt) => {
      evt.camera = this.camera;
      if(this.activeLevel) this.activeLevel.onMouseDown(evt);
    });
  }

  next() {
    this.levelIndex++;

    if(this.levelIndex >= this.levelCount) {
      // TODO credits and back to menu
      return;
    }

    let next = () => {
      this.load(this.levelIndex + 1, () => {});
      this.activeLevel = new Level(this.tween, this.scene);
      this.levels[this.levelIndex].call(this.activeLevel);
      this.activeLevel.addEventListener('complete', () => {
        this.activeLevel.dispatchEvent({type: 'destroy'});
        this.remove(this.activeLevel);
        this.next();
      });

      this.activeLevel.loadScene();
      this.add(this.activeLevel);

      var levelCompleteParams = {
        size: 1.5,
        height: 0.3,
        font: 'helvetiker',
        weight: 'bold',
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1
      };
      var levelCompleteMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color("#336633"),
        shininess: 100,
        specular: new THREE.Color('#00aa00')
      });

      var completeGeometry = new TextGeometry("LEVEL " + (this.levelIndex + 1), levelCompleteParams);
      var completeMesh = new THREE.Mesh(completeGeometry, levelCompleteMaterial);

      let box = new THREE.Box3().setFromObject(completeMesh);
      completeGeometry.applyMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(-(box.max.x - box.min.x) / 2, -(box.max.y - box.min.y) / 2, 0)));

      this.add(completeMesh);

      this.tween.add('ease-in-out', 500, (t) => {
        completeMesh.position.z = -(1 - t) * 30;
      }, () => {
        setTimeout(() => {
          this.tween.add('ease-in-out', 500, (t) => {
            completeMesh.position.z = t * 60;
          }, () => {
            this.remove(completeMesh);
          });

          this.activeLevel.next();
        }, 1000);
      });
    }

    if(this.levelIndex >= this.levels.length) {
      // load level and advance to it
      this.load(this.levelIndex, next);
    } else {
      // advance to next level
      next();
    }
  }

  load(level, next) {
    window.Loader.load(['/js/level-' + (level + 1) + '.js']).then((files) => {
      var params = ['level', 'loadTextures', 'loadMusic', 'Level', 'textures', 'music'];
      for(var v in tiles) if(v !== 'default') params.push(v);

      let pending = 0;

      let textures = {};
      let music = {};

      var args = [(level, controller) => {
        this.levels[level] = controller;
      }, mapping => {
        let cubeLoader = new THREE.CubeTextureLoader(Loader.manager);
        let loader = new THREE.TextureLoader(Loader.manager);

        Object.keys(mapping).forEach(v => {
          if(Array.isArray(mapping[v])) {
            pending++;
            cubeLoader.load(mapping[v], (texture) => {
              textures[v] = texture;
              if(--pending === 0) next();
            });
          } else {
            pending++;
            loader.load(mapping[v], (texture) => {
              textures[v] = texture;
              if(--pending === 0) next();
            });
          }
        });
      }, mapping => {
        for(var v in mapping) {
          music[v] = new Audio(mapping[v]);
        }
      }, Level, textures, music];
      for(var v in tiles) if(v !== 'default') args.push(tiles[v]);

      params.push('Board'); args.push(Board);

      for(var v in files) Function.apply(Function, params.concat([files[v]])).apply(null, args);
      if(pending === 0) next();
    }).catch(err => {
      console.error(err);
    });
  }

  update(delta) {
    this.score.update(delta);
    this.tween.update(delta);
    if(this.activeLevel) this.activeLevel.update(delta);
  }

  render(renderer, scene, camera) {
    if(this.activeLevel) this.activeLevel.render(renderer, scene, camera);
  }
};
