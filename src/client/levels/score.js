
import THREE from 'three';
import Tween from '../tween';
import TextGeometry from '../components/text';

export default class Score extends THREE.Object3D {

  constructor() {
    super();

    this.digits = [];
    this.displayedDigits = [];
    this.value = 0;

    var scoreParams = {
      size: 1,
      height: 0.3,
      font: 'helvetiker',
      weight: 'bold',
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1
    };
    var scoreMaterial = new THREE.MeshPhongMaterial({ color:  new THREE.Color("#663300"), shininess: 100, specular: new THREE.Color('#aaaa00') });

    for(var i = 0; i < 10; i++) {
      var scoreGeometry = new TextGeometry(i.toString(), scoreParams);
      this.digits[i] = new THREE.Mesh(scoreGeometry, scoreMaterial);
    }

    this.tween = new Tween();

    this.updateQueue = [];
    this.updating = false;
    this.scoreEvents = {};
    this.multiplier = 1;
    this.updateScore();

    this.position.set(-10, 7, 0);
  }

  addScore(group) {
    let score = group.reduce((a, b) => a + b.multiplier, 0);
    score *= group.length * this.multiplier;

    console.info(score);
    this.value += score;
    this.updateScore();
  }

  updateScore() {
    if(this.updating) return this.updateQueue.push(this.value);
    this.updating = true;

    this.updateQueue.push(this.value);

    (function next() {
      let update = this.updateQueue.shift();
      if(typeof update === 'undefined') {
        this.updating = false;

        let slot = ((this.value / 5000) | 0).toString();
        if (!this.scoreEvents[slot]) {
          this.scoreEvents[slot] = true;
          setTimeout(() => {
            _gs('event', 'Scored ' + slot * 5000);
          });
        }
        let el = document.getElementById("tweet-container");
        while (el.firstChild) el.removeChild(el.firstChild);

        twttr.widgets.createShareButton(
          "http://gems.grexie.com/",
          el,
          {
            size: "large",
            via: "grexie",
            related: "grexie",
            text: "I just scored " + this.value + ' in Grexie Gems. Think you can beat me?',
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
          }, function (response) {
          });
        });

        return;
      }

      if(this.multiplier < 32) {
        this.multiplier *= 2;
        setTimeout(() => this.multiplier /= 2, 2500);
      }


      let value = update.toString().split('');
      let x = 0;
      var pending = 0;
      for (var i = value.length - 1; i >= 0; i--) {
        let digit = this.digits[parseInt(value[i], 10)].clone();

        let box = new THREE.Box3().setFromObject(digit);
        x = digit.position.x = x - (box.max.x - box.min.x) - 0.05;
        digit.position.y = 0;

        ((o, n) => {
          if (!o) return;

          n.mesh.rotateX(Math.PI / 2);
          pending++;
          this.tween.add('ease-in-out', 400, (t) => {
            o.mesh.rotation.x = -t * Math.PI / 2;
            n.mesh.rotation.x = 2 * (1 - t) * Math.PI;
          }, () => {
            this.remove(o.mesh);
            if(--pending <= 0) next.call(this);
          });
        })(this.displayedDigits[i], this.displayedDigits[i] = {digit: value[i], mesh: digit});
        this.add(digit);
      }
      if(pending <= 0) next.call(this);
    }).call(this);
  }

  update(delta) {
    this.tween.update(delta);
  }

}
