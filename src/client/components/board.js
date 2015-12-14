
import THREE from 'three';
import Gems from './gems';
import Tween from '../tween';

class SwapQueue {
  constructor(board) {
    this.board = board;
    this.queue = [];
    this.lastOp = null;
  }

  cancel(next) {
    this.completing = true;
    let head = this.queue[0];
    if(!head) {
      if (this.lastOp) {
        this.queue.push(head = new SwapOperation(this.lastOp.gem, this.lastOp.adjacentGem, this.lastOp.sx, 0, this.lastOp.sy, 0));
      }
      else {
        this.completing = false;
        return next();
      }
    }
    this.queue = this.queue.slice(0, 1);
    head.cancel(() => {
      this.completing = false;
      next();
    });
    this.run();
  }

  complete(next) {
    this.completing = true;
    let tail = this.queue[this.queue.length - 1];
    if(!tail) {
      if(this.lastOp) {
        this.queue.push(tail = new SwapOperation(this.lastOp.gem, this.lastOp.adjacentGem, this.lastOp.sx, this.lastOp.tx, this.lastOp.sy, this.lastOp.ty));
      }
      else {
        this.completing = false;
        return next();
      }
    }

    if(tail.sx && tail.tx < Math.PI / 3 || tail.sy && tail.ty < Math.PI / 3) {
      return this.cancel(next);
    }

    tail.complete(() => {
      let adjacentStartPosition = tail.adjacentGem.startPosition;
      let adjacentIndex = this.board.gems.indexOf(tail.adjacentGem);

      this.board.gems[this.board.gems.indexOf(tail.gem)] = tail.adjacentGem;
      tail.adjacentGem.startPosition = tail.gem.startPosition;
      this.board.gems[adjacentIndex] = tail.gem;
      tail.gem.startPosition = adjacentStartPosition;

      this.completed = true;
      this.completing = false;

      this.board.validate(() => {
        next();
      });
    });
    this.run();
  }

  run() {
    if(this.running) return;
    this.running = true;

    let head = this.queue[0];
    if(!head) {
      this.running = false;
      return;
    }

    var completed = false;
    this.board.tween.add('ease-in-out', head.duration, (delta) => {
      if(completed) alert('completed');
      if(head.sx) {
        let { gem, adjacentGem, sx } = head;
        let tx = head.tx * delta;

        if(this.lastOp && this.lastOp.matches(gem, adjacentGem)) {
          tx = this.lastOp.tx + (head.tx - this.lastOp.tx) * delta;
        }

        gem.position.x = gem.startPosition.x + sx * (1 + Math.cos(Math.PI - tx));
        gem.position.y = gem.startPosition.y;
        gem.position.z = gem.startPosition.z + 1 + Math.sin(Math.PI - tx);
        gem.updateCubeMap = true;

        adjacentGem.position.x = adjacentGem.startPosition.x - sx * (1 + Math.cos(Math.PI - tx));
        adjacentGem.position.y = adjacentGem.startPosition.y;
        adjacentGem.position.z = adjacentGem.startPosition.z - ( Math.sin(Math.PI - tx));
        adjacentGem.updateCubeMap = true;
      } else if(head.sy) {
        let { gem, adjacentGem, sy } = head;
        let ty = head.ty * delta;

        if(this.lastOp && this.lastOp.matches(gem, adjacentGem)) {
          ty = this.lastOp.ty + (head.ty - this.lastOp.ty) * delta;
        }

        gem.position.x = gem.startPosition.x;
        gem.position.y = gem.startPosition.y + sy * (1 + Math.cos(Math.PI - ty));
        gem.position.z = gem.startPosition.z + 1 + Math.sin(Math.PI - ty);
        gem.updateCubeMap = true;

        adjacentGem.position.x = adjacentGem.startPosition.x;
        adjacentGem.position.y = adjacentGem.startPosition.y - sy * (1 + Math.cos(Math.PI - ty));
        adjacentGem.position.z = adjacentGem.startPosition.z - ( Math.sin(Math.PI - ty));
        adjacentGem.updateCubeMap = true;
      }
    }, () => {
      completed = true;
      var op = this.queue.shift();
      if(op) this.lastOp = op;
      this.running = false;
      if(op && op.next) op.next();
      this.run();
    })
  }

  add(gem, sx, tx, sy, ty) {
    if(this.completing) return;

    if(tx > ty) {
      let adjacentGem = this.board.adjacentGem(gem, sx, 0);
      this.queue.slice(0, this.queue.length - 1).forEach(op => op.cancel());
      if(this.queue.length && this.queue[this.queue.length - 1].matches(gem, adjacentGem)) {
        this.queue[this.queue.length - 1].tx = tx;
      } else {
        this.queue.forEach(op => op.cancel());
        this.queue.push(new SwapOperation(gem, adjacentGem, sx, tx, 0, 0, 400));
        this.run();
      }
    } else {
      let adjacentGem = this.board.adjacentGem(gem, 0, sy);
      this.queue.slice(0, this.queue.length - 1).forEach(op => op.cancel());
      if(this.queue.length && this.queue[this.queue.length - 1].matches(gem, adjacentGem)) {
        this.queue[this.queue.length - 1].ty = ty;
      } else {
        this.queue.forEach(op => op.cancel());
        this.queue.push(new SwapOperation(gem, adjacentGem, 0, 0, sy, ty, 400));
        this.run();
      }
    }
  }
}

class SwapOperation {
  constructor(gem, adjacentGem, sx, tx, sy, ty, duration = 400) {
    this.gem = gem;
    this.adjacentGem = adjacentGem;
    this.sx = sx;
    this.tx = tx;
    this.sy = sy;
    this.ty = ty;
    this.duration = duration;
  }

  matches(gem, adjacentGem) {
    return this.gem === gem && this.adjacentGem === adjacentGem;
  }

  cancel(next) {
    this.tx = this.ty = 0;
    this.next = next;
  }

  complete(next) {
    this.tx = this.ty = Math.PI;
    this.next = next;
  }
}

export default class Board extends THREE.Object3D {
  constructor(width, height) {
    super();
    THREE.EventDispatcher.call(this);

    this.width = width || 10;
    this.height = height || 10;
    this.tween = new Tween();

    this.gems = [];
    let types = Object.keys(Gems);

    for(var j = 0; j < this.height; j++) {
      for(var i = 0; i < this.width; i++) {
        let type = Gems[types[Math.random() * types.length | 0]];

        let gem = new type();
        gem.position.x = i * 2 - this.width + 1;
        gem.position.y = j * 2 - this.width + 1;
        gem.position.z = 0;
        gem.startPosition = gem.position.clone();
        gem.rotateY(Math.random() * Math.PI * 2);
        gem.updateCubeMap = true;
        this.gems.push(gem);
        this.add(gem);
      }
    }

    this.resetPositions();
    this.animating = 0;

    this.swapQueue = new SwapQueue(this);

    setTimeout(() => {
      this.validate();
    }, 0);
  }

  resetPositions(next) {
    var pending = 0;
    for(var j = 0; j < this.height; j++) {
      for(var i = 0; i < this.width; i++) {
        let gem = this.gems[j * this.width + i];
        if(!gem) continue;
        ((position, i, j) => {
          let x = i * 2 - this.width + 1;
          let y = j * 2 - this.width + 1;
          let z = 0;
          gem.startPosition = new THREE.Vector3(x, y, z);
          pending++;
          this.tween.add('ease-in-out', 500, (t) => {
            gem.position.x = position.x + (x - position.x) * t;
            gem.position.y = position.y + (y - position.y) * t;
            gem.position.z = position.z + (z - position.z) * t;
          }, () => {
            if(--pending <= 0) next();
          })
        })(gem.position.clone(), i, j);
      }
    }
  }

  findAdjacent(i, adjacent = null) {
    adjacent = adjacent || [];
    adjacent.push(i);

    if(i % this.width !== 0 && adjacent.indexOf(i - 1) === -1 && this.gems[i - 1].destroyed === false && this.gems[i - 1].type === this.gems[i].type) {
      this.findAdjacent(i - 1, adjacent);
    }
    if(i % this.width !== this.width - 1 && adjacent.indexOf(i + 1) === -1 && this.gems[i + 1].destroyed === false && this.gems[i + 1].type === this.gems[i].type) {
      this.findAdjacent(i + 1, adjacent);
    }
    if(i >= this.width && adjacent.indexOf(i - this.width) === -1 && this.gems[i - this.width].destroyed === false && this.gems[i - this.width].type === this.gems[i].type) {
      this.findAdjacent(i - this.width, adjacent);
    }
    if(i < this.width * (this.height - 1) && adjacent.indexOf(i + this.width) === -1 && this.gems[i + this.width].destroyed === false && this.gems[i + this.width].type === this.gems[i].type) {
      this.findAdjacent(i + this.width, adjacent);
    }

    return adjacent;
  }

  validate(next) {
    if(this.validating) return ;
    this.validating = true;

    var groups = [], cache = [];
    for(var i = 0; i < this.gems.length; i++) {
      if(cache.indexOf(i) !== -1) continue;
      let adjacent = this.findAdjacent(i);
      cache.push.apply(cache, adjacent);
      if(adjacent.length >= 3) groups.push(adjacent);
    }

    let columns = [];
    for(let i = 0; i < this.width; i++) {
      columns.push(0);
    }

    let finalize = () => {
      for(let j = 0; j < this.width; j++) {

        // generate new gems
        let nextGems = [];
        let types = Object.keys(Gems);
        for(let i = 0; i < columns[j]; i++) {
          let type = Gems[types[Math.random() * types.length | 0]];

          let gem = new type();
          nextGems.push(gem);
        }

        // let gravity act on the existing gems
        for(let i = 0; i < this.height; i++) {
          let m = i * this.width + j;
          if(this.gems[m]) continue;

          for(var k = i + 1; k < this.width; k++) {
            let n = k * this.width + j;

            if(this.gems[n]) {
              this.gems[m] = this.gems[n];
              this.gems[n] = null;
              break;
            }
          }

          if(k === this.width) {
            let gem = this.gems[m] = nextGems.shift();
            gem.position.x = j * 2 - this.width + 1;
            gem.position.y = i * 2 - this.height + 1;
            gem.position.y += i * 2;
            gem.position.z = 0;
            gem.startPosition = gem.position.clone();
            gem.rotateY(Math.random() * Math.PI * 2);
            this.add(gem);
          }
        }
      }

      this.resetPositions(() => {
        setTimeout(() => {
          this.validating = false;
          this.validate(next);
        }, 0);
      });
    };

    let pending = 0;
    if(groups.length === 0) {
      this.validating = false;
      return next();
    }
    groups.forEach(group => {
      group = group.map(i => {
        columns[i % this.width]++;
        return this.gems[i];
      });

      this.dispatchEvent({ type: 'destroy', group: group });

      group.forEach(gem => {
        if(!gem) return;

        pending++;
        setTimeout(() => {
          gem.destroy(this.tween, () => {
            let i = this.gems.indexOf(gem);
            this.remove(gem);
            this.gems[i] = null;

            if (--pending <= 0) finalize();
          })
        }, 0);
      });
    });
  }

  update(delta) {
    this.tween.update(delta);

    if(Math.random() * delta < 0.00005) {
      (function animate(gem) {
        if(!gem || gem.animating) return;
        gem.animating = true;
        let direction = Math.sign(Math.random() - 0.5);
        let startRotation = gem.rotation.y;
        this.tween.add('ease-in-out', 5000, (delta) => {
          gem.rotation.y = startRotation + direction * delta * Math.PI;
          gem.animating = false;
        }, () => {
        })
      }).call(this, this.gems[Math.random() * this.gems.length | 0]);
    }

    this.gems.forEach(gem => gem && gem.update(delta));
  }

  hitTest(camera, x, y) {
    var v = new THREE.Vector3(x, y, 1);
    v.unproject(camera);
    var ray = new THREE.Raycaster(camera.position, v.sub(camera.position).normalize() );
    var intersections = ray.intersectObjects(this.gems);
    return intersections[0].object;
  }

  adjacentGem(gem, sx, sy) {
    let i = this.gems.indexOf(gem);

    if(sx < 0) {
      return this.gems[i - 1];
    } else if(sx > 0) {
      return this.gems[i + 1];
    } else if(sy < 0) {
      return this.gems[i - this.width];
    } else if(sy > 0) {
      return this.gems[i + this.width];
    }
  }



  // render each 9-block of gems, to create the illusion of reflection
  render(renderer, scene, camera) {
    //this.gems.forEach((gem) => gem ? gem.visible = false : null);
    this.gems.forEach((gem) => {
      if(!gem) return;

      //let surroundingGems = [gem];
      /*if(i >= this.width) {
        if(i % this.width > 0) surroundingGems.push(this.gems[i - this.width - 1]);
        surroundingGems.push(this.gems[i - this.width]);
        if(i % this.width !== this.width - 1) surroundingGems.push(this.gems[i - this.width + 1]);
      }
      if(i % this.width > 0) surroundingGems.push(this.gems[i - 1]);
      if(i % this.width !== this.width - 1) surroundingGems.push(this.gems[i + 1]);
      if(i < this.width * (this.height - 1)) {
        if(i % this.width > 0) surroundingGems.push(this.gems[i + this.width - 1]);
        surroundingGems.push(this.gems[i + this.width]);
        if(i % this.width !== this.width - 1) surroundingGems.push(this.gems[i + this.width + 1]);
      }*/
      //surroundingGems.forEach(gem => gem ? gem.visible = true : null);

      gem.render(renderer, scene, camera);

      //surroundingGems.forEach(gem => gem ? gem.visible = false : null);
    });
    //this.gems.forEach((gem) => gem ? gem.visible = true : null);
  }
}
