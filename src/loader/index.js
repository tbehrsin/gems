
import THREE from 'three';
import Tween from '../client/tween';
import _Logo from './logo.json';

class Loader extends THREE.Scene {

  static start(window, selector) {
    let container = window.document.querySelector(selector);
    let loader = new Loader(window);
    container.appendChild(loader.renderer.domElement);
    return loader;
  }

  constructor(window) {
    super();

    this.tween = new Tween();
    this.visible = false;

    this.clock = new THREE.Clock();
    this.window = window;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.fog = new THREE.Fog();
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 2, 10000);

    window.onresize = () => {
      if(window.innerWidth < 1 && window.innerHeight < 1) return;
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.render(this.renderer, this, this.camera);
    };

    this.camera.position.set(0,10,30);
    this.camera.lookAt(0,0,0);
    this.camera.updateProjectionMatrix();

    this.add(new THREE.AmbientLight(0x111111));

    this.light = new THREE.SpotLight(0xffffff);
    this.light.tX = 0;
    this.light.tY = 0;
    this.add(this.light);

    let logoGeometry = new THREE.JSONLoader().parse(_Logo).geometry;
    let logoMaterial = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      specular: 0xffffff,
      shading: THREE.SmoothShading
    });
    this.logo = new THREE.Mesh(logoGeometry, logoMaterial);
    this.logo.position.set(0, 10, -60);
    this.logo.scale.set(10,10,10);
    this.logo.rotateX(Math.PI/3);
    this.add(this.logo);

    this.manager = new THREE.LoadingManager();
    this.manager.onProgress = (item, loaded, total) => {
      this.progress = loaded / total;
    };


    this.show().then(() => {
      setTimeout(() => {
        this.load([
          '/js/client.js'
        ]).then(files => {
          for (var v in files) eval(files[v]);

          Application.start(window, 'main[name=app]');
        });
      }, 0);
    });
  }

  load(files) {
    let progress = [];

    let calculateProgress = () => {
      let total = 0;
      let loaded = 0;

      progress.forEach(p => {
        total += p.total;
        loaded += p.loaded;
      });

      if(total > 0) {
        this.progress = loaded / total;
      } else {
        this.progress = 0;
      }
    };

    return new Promise((resolve, reject) => {
      let pending = 0;
      files.forEach((file, i) => {
        pending++;
        let xhr = new this.window.XMLHttpRequest();
        xhr.onprogress = (evt) => {
          if(evt.lengthComputable) {
            progress[i].loaded = evt.loaded;
            progress[i].total = evt.total;
            calculateProgress();
          }
        };
        progress.push({ loaded: 0, total: 0, xhr: xhr });

        xhr.onreadystatechange = (evt) => {
          if(xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
            if(--pending === 0) return resolve();
          }
        };

        xhr.open('GET', file, true);
        xhr.send(null);
      });
    }).then(() => {
      let out = {};
      files.forEach((file, i) => {
        out[file] = progress[i].xhr.responseText;
      });
      return out;
    }).catch(err => {
      console.error(err);
      throw err;
    });
  }

  set progress(value) {
    let progress = this.window.document.querySelector('.progress-bar > div');
    progress.style.width = Math.min(100, value * 100 | 0) + '%';
  }

  show() {
    return new Promise((resolve, reject) => {
      if (this.visible) return resolve();
      this.visible = true;
      let main = this.window.document.querySelector('main[name=loader]');
      this.stop = false;
      this.start();

      this.tween.add('ease-in-out', 1000, (t) => {
        main.style.opacity = t;
      }, () => {
        setTimeout(resolve, 1000);
      });
    });
  }

  hide() {
    if(!this.visible) return;
    let main = this.window.document.querySelector('main[name=loader]');

    setTimeout(() => {
      this.tween.add('ease-in-out', 1000, (t) => {
        main.style.opacity = 1 - t;
      }, () => {
        this.visible = false;
        this.stop = true;
      });
    }, 0);
  }

  start() {
    if(this.stop) {
      return;
    } else {
      requestAnimationFrame(this.start.bind(this));
      var delta = this.clock.getDelta();
      this.update(delta);
      this.render(this.renderer, this, this.camera);
    }
  }

  update(delta) {
    this.tween.update(delta);
    this.light.tX += delta;
    this.light.tY += delta;
    this.light.position.set(-60 * Math.cos(this.light.tX * Math.PI / 2), 60 * Math.sin(this.light.tY * Math.PI / 2), 30);
  }

  render(renderer, scene, camera) {
    renderer.render(scene, camera);
  }
}

window.Loader = Loader.start(window, 'main[name=loader]');
