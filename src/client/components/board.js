
import THREE from 'three';
import { NextTile } from './tiles';
import Tween from '../tween';
import _Clink1Sound from '../sounds/clink1.mp3';
import _Clink2Sound from '../sounds/clink2.mp3';
import _Clink3Sound from '../sounds/clink3.mp3';
import _Clink4Sound from '../sounds/clink4.mp3';
import _ScratchSound from '../sounds/scratch_scrape.mp3';

class Sound {
  constructor(size, ...filenames) {
    this.templates = filenames.map(filename => new Audio(filename));

    this.pool = [];
    for(var i = 0; i < size; i++) {
      this.enqueue();
    }
  }

  enqueue() {
    this.templates.map(template => {
      let audio = template.cloneNode();
      audio.addEventListener('ended', () => {
        audio.play();
        audio.pause();
        this.pool.push(audio);
      })
      audio.play();
      audio.pause();
      this.pool.push(audio);
    });
  }

  play() {
    let audio = this.pool.shift();
    if(audio) audio.play();
  }
}


let ClinkSound = new Sound(4, _Clink1Sound, _Clink2Sound, _Clink3Sound, _Clink4Sound);
let ScratchSound = new Sound(10, _ScratchSound);

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
        this.queue.push(head = new SwapOperation(this.lastOp.tile, this.lastOp.adjacentTile, this.lastOp.sx, 0, this.lastOp.sy, 0));
      }
      else {
        this.completing = false;
        return next();
      }
    }
    this.queue = this.queue.slice(0, 1);
    head.cancel(() => {
      this.completing = false;
      this.lastOp = null;
      next();
    });
    this.run();
  }

  complete(next) {
    this.completing = true;
    let tail = this.queue[this.queue.length - 1];
    if(!tail) {
      if(this.lastOp) {
        this.queue.push(tail = new SwapOperation(this.lastOp.tile, this.lastOp.adjacentTile, this.lastOp.sx, this.lastOp.tx, this.lastOp.sy, this.lastOp.ty));
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
      let adjacentStartPosition = tail.adjacentTile.startPosition;
      let adjacentIndex = this.board.tiles.indexOf(tail.adjacentTile);

      this.board.tiles[this.board.tiles.indexOf(tail.tile)] = tail.adjacentTile;
      tail.adjacentTile.startPosition = tail.tile.startPosition;
      this.board.tiles[adjacentIndex] = tail.tile;
      tail.tile.startPosition = adjacentStartPosition;

      this.completed = true;
      this.completing = false;

      this.board.validate(() => {
        this.lastOp = null;
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
        let { tile, adjacentTile, sx } = head;
        let tx = head.tx * delta;

        if(this.lastOp && this.lastOp.matches(tile, adjacentTile)) {
          tx = this.lastOp.tx + (head.tx - this.lastOp.tx) * delta;
        } else if(this.lastOp) {
          this.lastOp.adjacentTile.position.copy(this.lastOp.adjacentTile.startPosition);
          this.lastOp.adjacentTile.position.multiplyScalar(this.board.zoom);
        }

        tile.position.x = tile.startPosition.x + sx * (1 + Math.cos(Math.PI - tx));
        tile.position.y = tile.startPosition.y;
        tile.position.z = tile.startPosition.z + 1 + Math.sin(Math.PI - tx);
        tile.position.multiplyScalar(this.board.zoom);

        adjacentTile.position.x = adjacentTile.startPosition.x - sx * (1 + Math.cos(Math.PI - tx));
        adjacentTile.position.y = adjacentTile.startPosition.y;
        adjacentTile.position.z = adjacentTile.startPosition.z - (Math.sin(Math.PI - tx));
        adjacentTile.position.multiplyScalar(this.board.zoom);
      } else if(head.sy) {
        let { tile, adjacentTile, sy } = head;
        let ty = head.ty * delta;

        if(this.lastOp && this.lastOp.matches(tile, adjacentTile)) {
          ty = this.lastOp.ty + (head.ty - this.lastOp.ty) * delta;
        } else if(this.lastOp) {
          this.lastOp.adjacentTile.position.copy(this.lastOp.adjacentTile.startPosition);
          this.lastOp.adjacentTile.position.multiplyScalar(this.board.zoom);
        }

        tile.position.x = tile.startPosition.x;
        tile.position.y = tile.startPosition.y + sy * (1 + Math.cos(Math.PI - ty));
        tile.position.z = tile.startPosition.z + 1 + Math.sin(Math.PI - ty);
        tile.position.multiplyScalar(this.board.zoom);
        tile.updateCubeMap = true;

        adjacentTile.position.x = adjacentTile.startPosition.x;
        adjacentTile.position.y = adjacentTile.startPosition.y - sy * (1 + Math.cos(Math.PI - ty));
        adjacentTile.position.z = adjacentTile.startPosition.z - ( Math.sin(Math.PI - ty));
        adjacentTile.position.multiplyScalar(this.board.zoom);
        adjacentTile.updateCubeMap = true;
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

  add(tile, sx, tx, sy, ty) {
    if(this.completing) return;

    if(tx > ty) {
      let adjacentTile = this.board.adjacentTile(tile, sx, 0);
      if(!adjacentTile) return;

      this.queue.slice(0, this.queue.length - 1).forEach(op => op.cancel());
      if(this.queue.length && this.queue[this.queue.length - 1].matches(tile, adjacentTile)) {
        this.queue[this.queue.length - 1].tx = tx;
      } else {
        this.queue.forEach(op => op.cancel());
        this.queue.push(new SwapOperation(tile, adjacentTile, sx, tx, 0, 0, 400));
        this.run();
      }
    } else {
      let adjacentTile = this.board.adjacentTile(tile, 0, sy);
      if(!adjacentTile) return;

      this.queue.slice(0, this.queue.length - 1).forEach(op => op.cancel());
      if(this.queue.length && this.queue[this.queue.length - 1].matches(tile, adjacentTile)) {
        this.queue[this.queue.length - 1].ty = ty;
      } else {
        this.queue.forEach(op => op.cancel());
        this.queue.push(new SwapOperation(tile, adjacentTile, 0, 0, sy, ty, 400));
        this.run();
      }
    }
  }
}

class SwapOperation {
  constructor(tile, adjacentTile, sx, tx, sy, ty, duration = 400) {
    this.tile = tile;
    this.adjacentTile = adjacentTile;
    this.sx = sx;
    this.tx = tx;
    this.sy = sy;
    this.ty = ty;
    this.duration = duration;
  }

  matches(tile, adjacentTile) {
    return this.tile === tile && this.adjacentTile === adjacentTile;
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
  constructor(width, height, nextTile) {
    super();
    THREE.EventDispatcher.call(this);

    this.zoom = 1;
    this.width = width || 10;
    this.height = height || 10;
    this.tween = new Tween();

    this.nextTile = nextTile || (() => new (NextTile()));
    this.tiles = [];

    for(var j = 0; j < this.height; j++) {
      for(var i = 0; i < this.width; i++) {
        /*if(nextTiles.length) {
          var tile = new this.nextTiles.shift();
        } else {
          var type = tiles[types[Math.random() * types.length | 0]];
          var tile = new type();
        }*/

        let tile = this.nextTile();

        tile.position.x = i * 2 - this.width + 1;
        tile.position.y = j * 2 - this.width + 1;
        tile.position.z = 0;
        tile.position.multiplyScalar(this.zoom);
        tile.startPosition = tile.position.clone();
        tile.rotateY(Math.random() * Math.PI * 2);
        tile.updateCubeMap = true;
        this.tiles.push(tile);
        this.add(tile);
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
    setTimeout(() => {
      ClinkSound.play();
    }, 0);
    for(var j = 0; j < this.height; j++) {
      for(var i = 0; i < this.width; i++) {
        let tile = this.tiles[j * this.width + i];
        if(!tile) continue;
        ((position, i, j) => {
          let x = i * 2 - this.width + 1;
          let y = j * 2 - this.width + 1;
          let z = 0;
          tile.startPosition = new THREE.Vector3(x, y, z);
          pending++;
          this.tween.add('ease-in-out', 500, (t) => {
            tile.position.x = position.x + (x - position.x) * t;
            tile.position.y = position.y + (y - position.y) * t;
            tile.position.z = position.z + (z - position.z) * t;
            tile.position.multiplyScalar(this.zoom);
          }, () => {
            if(--pending <= 0) {
              next();
            }
          })
        })(tile.position.clone().multiplyScalar(1 / this.zoom), i, j);
      }
    }
  }

  findAdjacent(i, adjacent = null) {
    adjacent = adjacent || [];
    adjacent.push(i);

    if(i % this.width !== 0 && adjacent.indexOf(i - 1) === -1 && this.tiles[i - 1].destroyed === false && this.tiles[i - 1].type === this.tiles[i].type) {
      this.findAdjacent(i - 1, adjacent);
    }
    if(i % this.width !== this.width - 1 && adjacent.indexOf(i + 1) === -1 && this.tiles[i + 1].destroyed === false && this.tiles[i + 1].type === this.tiles[i].type) {
      this.findAdjacent(i + 1, adjacent);
    }
    if(i >= this.width && adjacent.indexOf(i - this.width) === -1 && this.tiles[i - this.width].destroyed === false && this.tiles[i - this.width].type === this.tiles[i].type) {
      this.findAdjacent(i - this.width, adjacent);
    }
    if(i < this.width * (this.height - 1) && adjacent.indexOf(i + this.width) === -1 && this.tiles[i + this.width].destroyed === false && this.tiles[i + this.width].type === this.tiles[i].type) {
      this.findAdjacent(i + this.width, adjacent);
    }

    return adjacent;
  }

  validate(next) {
    if(this.validating) return ;
    this.validating = true;

    var groups = [], cache = [];
    for(var i = 0; i < this.tiles.length; i++) {
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

        // generate new tiles
        let nextTiles = [];
        for(let i = 0; i < columns[j]; i++) {
          let tile = this.nextTile();
          nextTiles.push(tile);
        }

        // let gravity act on the existing tiles
        for(let i = 0; i < this.height; i++) {
          let m = i * this.width + j;
          if(this.tiles[m]) continue;

          for(var k = i + 1; k < this.width; k++) {
            let n = k * this.width + j;

            if(this.tiles[n]) {
              this.tiles[m] = this.tiles[n];
              this.tiles[n] = null;
              break;
            }
          }

          if(k === this.width) {
            let tile = this.tiles[m] = nextTiles.shift();
            tile.position.x = j * 2 - this.width + 1;
            tile.position.y = i * 2 - this.height + 1;
            tile.position.y += i * 2;
            tile.position.z = 0;
            tile.position.multiplyScalar(this.zoom);
            tile.startPosition = tile.position.clone();
            tile.rotateY(Math.random() * Math.PI * 2);
            this.add(tile);
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
      next();
      this.dispatchEvent({type:'validated'});
      return;
    }
    groups.forEach(group => {
      group = group.map(i => {
        columns[i % this.width]++;
        return this.tiles[i];
      });

      this.dispatchEvent({ type: 'destroy', group: group });
      group.forEach(tile => {
        if(!tile) return;

        pending++;
        setTimeout(() => {
          tile.destroy(this.tween, () => {
            let i = this.tiles.indexOf(tile);
            this.remove(tile);
            this.tiles[i] = null;

            if (--pending <= 0) finalize();
          })
        }, 0);
      });
    });
  }

  update(delta) {
    this.tween.update(delta);

    this.tiles.forEach(tile => tile && tile.update(delta));
  }

  hitTest(camera, x, y) {
    var v = new THREE.Vector3(x, y, 1);
    v.unproject(camera);
    var ray = new THREE.Raycaster(camera.position, v.sub(camera.position).normalize() );
    var intersections = ray.intersectObjects(this.tiles);
    return intersections[0].object;
  }

  adjacentTile(tile, sx, sy) {
    let i = this.tiles.indexOf(tile);

    if(sx < 0) {
      if(i % this.width === 0) return;

      return this.tiles[i - 1];
    } else if(sx > 0) {
      if(i % this.width === this.width - 1) return;

      return this.tiles[i + 1];
    } else if(sy < 0) {
      if(i < this.width) return;

      return this.tiles[i - this.width];
    } else if(sy > 0) {
      if(i >= this.width * (this.height - 1)) return;

      return this.tiles[i + this.width];
    }
  }



  // render each 9-block of tiles, to create the illusion of reflection
  render(renderer, scene, camera) {
    //this.tiles.forEach((tile) => tile ? tile.visible = false : null);
    this.tiles.forEach((tile) => {
      if(!tile) return;

      //let surroundingtiles = [tile];
      /*if(i >= this.width) {
        if(i % this.width > 0) surroundingtiles.push(this.tiles[i - this.width - 1]);
        surroundingtiles.push(this.tiles[i - this.width]);
        if(i % this.width !== this.width - 1) surroundingtiles.push(this.tiles[i - this.width + 1]);
      }
      if(i % this.width > 0) surroundingtiles.push(this.tiles[i - 1]);
      if(i % this.width !== this.width - 1) surroundingtiles.push(this.tiles[i + 1]);
      if(i < this.width * (this.height - 1)) {
        if(i % this.width > 0) surroundingtiles.push(this.tiles[i + this.width - 1]);
        surroundingtiles.push(this.tiles[i + this.width]);
        if(i % this.width !== this.width - 1) surroundingtiles.push(this.tiles[i + this.width + 1]);
      }*/
      //surroundingtiles.forEach(tile => tile ? tile.visible = true : null);

      tile.render(renderer, scene, camera);

      //surroundingtiles.forEach(tile => tile ? tile.visible = false : null);
    });
    //this.tiles.forEach((tile) => tile ? tile.visible = true : null);
  }
}
