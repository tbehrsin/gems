
import BezierEasing from 'bezier-easing'

export default class Tween {
  constructor() {
    this.states = [];
  }

  add(tf, duration, callback, next) {
    if(typeof tf === 'string') tf = BezierEasing.css[tf];

    callback(tf.get(0));

    var state = {
      tf: tf,
      callback: callback,
      next: next,
      time: 0,
      duration: duration,
      complete: false,
      accessor: {
        remove: () => {
          let index = this.states.indexOf(state);
          if(index === -1) return;
          this.states.splice(index, 1);
        }
      }
    };
    this.states.push(state);

    return state.accessor;
  }

  update(delta) {
    this.states.forEach(state => {
      if(state.complete) return;

      state.time += delta * 1000;
      if(state.time >= state.duration) {
        state.complete = true;
        state.time = state.duration;
        state.accessor.remove();
      }

      try {
        if(state.duration === 0) {
          state.callback(state.tf.get(1));
        } else {
          state.callback(state.tf.get(state.time / state.duration));
        }
      } catch(e) {
        console.error(e);
      }

      if(state.complete) {
        state.next();
      }
    });
  }


}
