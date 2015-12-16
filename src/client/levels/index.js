
import THREE from 'three';
import Score from './score';
import Level1 from './level-1';
import Level2 from './level-2';

export default new class Levels extends THREE.Object3D {
  constructor() {
    super();

    this.score = new Score(0);
    this.add(this.score);

    this.levelIndex = 0;
    this.levels = [
      Level1,
      Level2
    ];

    this.activeLevel = new this.levels[this.levelIndex]();
    this.add(this.activeLevel);
    this.activeLevel.next();

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


    window.addEventListener('resize', (evt) => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.animate();
    }, false);

    window.addEventListener('mousedown', (evt) => {
      evt.camera = this.camera;
      if(this.activeLevel) this.activeLevel.onMouseDown(evt);
    });

    //this.keys = Object.keys(Key).map((v) => { return false; });

    /*window.addEventListener('keyup', (evt) => {
      switch(evt.which) {
        case 37: this.keys[Key.LEFT] = false; break;
        case 38: this.keys[Key.UP] = false; break;
        case 39: this.keys[Key.RIGHT] = false; break;
        case 40: this.keys[Key.DOWN] = false; break;
      }
    });

    */


    /*this.board.addEventListener('destroy', (evt) => {


     if(evt.group.length > 5) this.score += evt.group.length * 127 * this.multiplier;
     else this.score += evt.group.length * 31 * this.multiplier;

     if(this.score >= 100000) {
     let slot = ((this.score / 100000) | 0).toString();
     if (!this.scoreEvents[slot]) {
     this.scoreEvents[slot] = true;
     setTimeout(() => {
     _gs('event', 'Scored ' + slot * 100000);

     let el = document.getElementById("tweet-container");
     while(el.firstChild) el.removeChild(el.firstChild);

     twttr.widgets.createShareButton(
     "http://gems.grexie.com/",
     el,
     {
     size: "large",
     via: "grexie",
     related: "grexie",
     text: "I just scored " + this.score + ' in Grexie Gems. Think you can beat me?',
     url: 'http://gems.grexie.com/',
     hashtags: "grexie,gems"
     }
     );

     let fbutton = document.createElement('button');
     fbutton.textContent = 'Share on Facebook';
     fbutton.className = 'fb-share-button';
     el.appendChild(fbutton);

     fbutton.addEventListener('click', () => {
     FB.ui({
     method: 'share',
     href: 'http://gems.grexie.com/',
     }, function(response){});
     });
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

     });*/
  }

  update(delta) {
    this.activeLevel.update(delta);
    this.score.update(delta);
  }
};
