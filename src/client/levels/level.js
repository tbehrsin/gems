
import THREE from 'three';
import Tween from '../tween';
import TextGeometry from '../components/text';
import ProgressBar from '../components/progress';

export default class Level extends THREE.Object3D {

  constructor(tween) {
    super();
    this.scenes = [];
    this.stages = [];
    this.stageIndex = -1;
    this.activeStage = null;
    this.previousStage = null;
    this.updaters = [];
    this.tween = tween;

    this.progress = new ProgressBar(5, 1, 1, 0, 1, 0, 'STAGE');
    this.progress.position.set(-12.75, 6, 0);
    this.progress.visible = false;
    this.add(this.progress);

    this.lock = false;
  }

  get score() {
    return this.parent.score;
  }

  scene(scope) {
    let scene = function() {
      THREE.Object3D.apply(this, arguments);
      this.tween = new Tween();
      scope.call(this);
    };
    scene.prototype = Object.create(THREE.Scene.prototype);
    this.scenes.push(scene);
  }

  stage(scope) {
    this.stages.push(scope);
  }

  next(next) {
    if(this.lock) return next && next(false);
    this.lock = true;

    var pending = 0;

    if(!this.activeScene) {
      this.activeScene = new this.scenes[0]();
      this.add(this.activeScene);
    }

    if(this.stageProgress) this.stageProgress.visible = false;
    this.previousStage = this.activeStage;
    if(this.stageIndex < this.stages.length - 1) {
      if(this.previousStage) {
        var stageCompleteParams = {
          size: 1.5,
          height: 0.3,
          font: 'helvetiker',
          weight: 'bold',
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1
        };
        var stageCompleteMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color("#003366"),
          shininess: 100,
          specular: new THREE.Color('#00aaaa')
        });

        var completeGeometry = new TextGeometry("STAGE COMPLETE", stageCompleteParams);
        var completeMesh = new THREE.Mesh(completeGeometry, stageCompleteMaterial);

        let box = new THREE.Box3().setFromObject(completeMesh);
        completeGeometry.applyMatrix( new THREE.Matrix4().setPosition(new THREE.Vector3(- (box.max.x - box.min.x) / 2, - (box.max.y - box.min.y) / 2, 0 ) ));

        this.add(completeMesh);

        this.tween.add('ease-in-out', 500, (t) => {
          completeMesh.position.z = - (1 - t) * 30;
        }, () => {
          this.tween.add('ease-in-out', 1500, (t) => {
            completeMesh.rotation.x = 6 * t * Math.PI;
          })
        })
      }


      pending++;
      setTimeout(() => {
        this.tween.add('ease-in-out', 500, (t) => {
          if(completeMesh) completeMesh.position.z = t * 60;
        }, () => {
          if(completeMesh) this.remove(completeMesh);

          this.stageIndex++;
          this.activeStage = new this.stages[this.stageIndex]();

          this.stageProgress = this.activeStage.progress = new ProgressBar(5, 1, 1, 0, 1, 0, '');
          this.activeStage.progress.position.set(-12.75, 4.5, 0);
          this.stageProgress.visible = false;
          this.add(this.activeStage.progress);

          this.add(this.activeStage.board);

          let box = new THREE.Box3().setFromObject(this.activeStage.board);
          var scale = 16 / Math.max(box.max.x - box.min.x, box.max.y - box.min.y);
          scale = Math.min(scale, 1.25);
          this.activeStage.board.scale.set(scale, scale, scale);
          this.progress.visible = true;
          this.progress.text = 'STAGE ' + (this.stageIndex + 1);
          this.progress.min = 0;
          this.progress.max = this.stages.length;
          this.progress.value = this.stageIndex;
          this.tween.add('ease-in-out', 750, (t) => {
            this.activeStage.board.position.z = 60 * (t - 1);
          }, () => {
            this.lock = false;
            this.stageProgress.visible = true;
            if ((--pending === 0) && (next)) {
              next(this.stageIndex >= this.stages.length);
            } else if(pending === 0) {
              if(this.stageIndex >= this.stages.length) this.dispatchEvent({type:'complete'});
            }
          });
        });
      }, completeMesh ? 2000 : 0);
    } else {
      this.activeStage = null;
      this.stageIndex++;
    }

    if(this.previousStage) {
      pending++;
      let box = new THREE.Box3().setFromObject(this.previousStage.board);
      var scale = 16 / Math.max(box.max.x - box.min.x, box.max.y - box.min.y);
      scale = Math.min(scale, 1.25);
      this.tween.add('ease-in-out', 750, (t) => {
        this.previousStage.board.zoom = 1 + (16 / scale) * t;

        this.previousStage.board.children.forEach(child => {
          if (child.startPosition) child.position.copy(child.startPosition).multiplyScalar(1 + (16 / scale) * t);
          else {
            child.startPosition = child.position.clone();
            child.position.multiplyScalar(1 + (16 / scale) * t);
          }
          if(child.position.x == 0 && child.position.y == 0) {
            child.visible = false;
          }
        });
      }, () => {
        this.remove(this.previousStage.board);
        this.previousStage = null;
        this.lock = false;
        if((--pending === 0) && next) {
          next(this.stageIndex >= this.stages.length);
        } else if(pending === 0) {
          if(this.stageIndex >= this.stages.length) this.dispatchEvent({type:'complete'});
        }
      });
    }

    if((pending === 0) && next) {
      next(this.stageIndex >= this.stages.length);
    } else if(pending === 0) {
      if(this.stageIndex >= this.stages.length) this.dispatchEvent({type:'complete'});
    }
  }

  update(delta) {
    if(typeof delta === 'function') return this.updaters.push(delta);

    if(this.activeStage) {
      if(this.activeScene.update) this.activeScene.update(delta);
      this.activeScene.tween.update(delta);
    }

    if(this.activeStage) {
      this.activeStage.board.update(delta);
    }
    if(this.previousStage) {
      this.previousStage.board.update(delta);
    }

    this.updaters.forEach(updater => {
      try {
        updater(delta);
      } catch(e) {
        console.error(e);
      }
    });

    this.tween.update(delta);
    this.progress.update(delta);

    if(this.stageProgress) this.stageProgress.update(delta);
  }

  onMouseDown = (evt) => {
    if(!this.activeStage) return;
    if(this.activeStage.board.validating) return;
    let camera = evt.camera;

    let mouse = {
      x: (evt.clientX / window.innerWidth) * 2 - 1,
      y:  -(evt.clientY / window.innerHeight) * 2 + 1
    };
    let startGem = this.activeStage.board.hitTest(camera, mouse.x, mouse.y);
    if(!startGem) return;

    let scale = this.activeStage.board.scale.x;
    let gemCoords = new THREE.Vector3(startGem.position.x, startGem.position.y, 0).multiplyScalar(scale);

    var tweening = this.tween.add('ease-in-out', 150, (delta) => {
      startGem.position.z = delta * scale;
    }, () => {

    });

    let onmousemove = (evt) => {
      let mouseMove = {
        x: (evt.clientX / window.innerWidth) * 2 - 1,
        y:  -(evt.clientY / window.innerHeight) * 2 + 1
      };

      let sx = Math.sign(mouseMove.x - mouse.x);
      let sy = Math.sign(mouseMove.y - mouse.y);

      var v1 = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      v1.unproject(camera);
      v1.sub(camera.position).normalize();
      v1 = camera.position.clone().add(v1.multiplyScalar((scale - camera.position.z) / v1.z));

      var v2 = new THREE.Vector3(mouseMove.x, mouseMove.y, 0.5);
      v2.unproject(camera);
      v2.sub(camera.position).normalize();
      v2 = camera.position.clone().add(v2.multiplyScalar((scale - camera.position.z) / v2.z));

      let px = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      let ox = px.projectPoint(new THREE.Vector3(gemCoords.x + sx * scale, gemCoords.y, 0));
      let v1x = px.projectPoint(v1.clone()).sub(ox);
      let v2x = px.projectPoint(v2.clone()).sub(v1x).sub(ox);
      let tx1 = sx * Math.atan(v1x.x, v1x.z);
      let tx2 = sx * Math.atan(v2x.x, v2x.z);

      let py = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
      let oy = py.projectPoint(new THREE.Vector3(gemCoords.x, gemCoords.y + sy * scale + scale / 2, 0));
      let v1y = py.projectPoint(v1.clone()).sub(oy);
      let v2y = py.projectPoint(v2.clone()).sub(v1y).sub(oy);
      let ty1 = sy * Math.atan(v1y.y, v1y.z);
      let ty2 = sy * Math.atan(v2y.y, v2y.z);

      let tx = ((tx2 - tx1) - Math.PI / 4) / 0.5;
      let ty = ((ty2 - ty1) - Math.PI / 4) / 0.5;
      this.activeStage.board.swapQueue.add(startGem, sx, tx, sy, ty);
    };

    let onmouseup = (evt) => {
      window.removeEventListener('mousemove', onmousemove, false);
      window.removeEventListener('mouseup', onmouseup, false);

      this.activeStage.board.swapQueue.complete(() => {
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

  render(renderer, scene, camera) {
    if(this.activeScene) {
      scene.fog = this.activeScene.fog;
    }
    if(this.activeStage) {
      this.activeStage.board.render(renderer, scene, camera);
    }
  }
};
