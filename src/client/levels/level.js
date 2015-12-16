
import THREE from 'three';
import Tween from '../tween';

export default class Level extends THREE.Object3D {

  constructor() {
    super();
    this.stages = [];
    this.stageIndex = -1;
    this.activeStage = null;
    this.previousStage = null;
    this.updaters = [];
    this.tween = new Tween();

    this.lock = false;
  }

  get score() {
    return this.parent.score;
  }

  stage(scope) {
    this.stages.push(scope);
  }

  next(next) {
    if(this.lock) return next(false);
    this.lock = true;

    var pending = 0;

    this.previousStage = this.activeStage;
    if(this.stageIndex < this.stages.length - 1) {
      this.stageIndex++;
      this.activeStage = new this.stages[this.stageIndex]();

      this.add(this.activeStage.board);

      let box = new THREE.Box3().setFromObject(this.activeStage.board);
      var scale = 16 / Math.max(box.max.x - box.min.x, box.max.y - box.min.y);
      scale = Math.min(scale, 1.25);
      this.activeStage.board.scale.set(scale, scale, scale);

      pending++;
      this.tween.add('ease-in-out', 750, (t) => {
        this.activeStage.board.position.z = 60 * (t - 1);
      }, () => {
        this.lock = false;
        if(next && --pending === 0) next(this.stageIndex >= this.stages.length);
      });
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
        if(next && --pending === 0) next(this.stageIndex >= this.stages.length);
      });
    }

    if(next && pending === 0) next(this.stageIndex >= this.stages.length);
  }

  update(delta) {
    if(typeof delta === 'function') return this.updaters.push(delta);

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
  }

  onMouseDown = (evt) => {
    if(!this.activeStage) return;
    let camera = evt.camera;

    let mouse = {
      x: (evt.clientX / window.innerWidth) * 2 - 1,
      y:  -(evt.clientY / window.innerHeight) * 2 + 1
    };
    let startGem = this.activeStage.board.hitTest(camera, mouse.x, mouse.y);
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
      v1.unproject(camera);
      var v2 = new THREE.Vector3(mouseMove.x, 0, 1);
      v2.unproject(camera);

      var v3 = new THREE.Vector3(0, mouse.y, 1);
      v3.unproject(camera);
      var v4 = new THREE.Vector3(0, mouseMove.y, 1);
      v4.unproject(camera);

      let oppx = v2.distanceTo(v1);
      let adjx = camera.position.distanceTo(new THREE.Vector3(gemCoords.x + sx, gemCoords.y, 0));
      let oppy = v4.distanceTo(v3);
      let adjy = camera.position.distanceTo(new THREE.Vector3(gemCoords.x, gemCoords.y + sy, 0));

      let tx = Math.min(Math.PI, Math.max(0, oppx / adjx));
      let ty = Math.min(Math.PI, Math.max(0, oppy / adjy));

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
};
