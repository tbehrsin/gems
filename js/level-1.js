/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "https://tbehrsin.github.io/gems/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 38);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vertex_glsl__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vertex_glsl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vertex_glsl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fragment_glsl__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fragment_glsl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__fragment_glsl__);
/**
 * Simple test shader
 */


/* harmony default export */ __webpack_exports__["a"] = ({
  vertexShader: __WEBPACK_IMPORTED_MODULE_0__vertex_glsl___default.a,
  fragmentShader: __WEBPACK_IMPORTED_MODULE_1__fragment_glsl___default.a,
  uniforms: {}
});

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports) {

module.exports = "uniform vec3 glowColor;\nvarying float intensity;\nvoid main()\n{\n\tvec3 glow = glowColor * intensity;\n    gl_FragColor = vec4( glow, 1.0 );\n}\n"

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "uniform vec3 viewVector;\nuniform float c;\nuniform float p;\nvarying float intensity;\n\nvoid main()\n{\n    vec3 vNormal = normalize( normalMatrix * normal );\n\tvec3 vNormel = normalize( normalMatrix * viewVector );\n\tintensity = pow( c - dot(vNormal, vNormel), p );\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n"

/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/images/Moon-18uYMYtS.jpg";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/images/Moon2-Bump-k8yWBpvX.jpg";

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/images/deep-space-1-7wzUdMeU.jpg";

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/images/deep-space-2-5oWwECyH.jpg";

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/images/deep-space-3-34Q0blFJ.jpg";

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/images/deep-space-4-2IvigzN1.jpg";

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/images/deep-space-5-2aBfA0T7.jpg";

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/images/deep-space-6-3TAKSpiQ.jpg";

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/images/gas-giant-yellow-1y3sp5IZ.jpg";

/***/ }),
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/images/music-crystal-drop-fall-7inrKdM9.mp3";

/***/ }),
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__images_deep_space_1_jpg__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__images_deep_space_1_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__images_deep_space_1_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__images_deep_space_2_jpg__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__images_deep_space_2_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__images_deep_space_2_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__images_deep_space_3_jpg__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__images_deep_space_3_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__images_deep_space_3_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__images_deep_space_4_jpg__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__images_deep_space_4_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__images_deep_space_4_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__images_deep_space_5_jpg__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__images_deep_space_5_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__images_deep_space_5_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__images_deep_space_6_jpg__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__images_deep_space_6_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__images_deep_space_6_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sounds_music_crystal_drop_fall_mp3__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sounds_music_crystal_drop_fall_mp3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__sounds_music_crystal_drop_fall_mp3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__images_gas_giant_yellow_jpg__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__images_gas_giant_yellow_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__images_gas_giant_yellow_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__images_Moon_jpg__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__images_Moon_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__images_Moon_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__images_Moon2_Bump_jpg__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__images_Moon2_Bump_jpg___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__images_Moon2_Bump_jpg__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__shaders_glow__ = __webpack_require__(3);











loadTextures({
  SkyBox: [__WEBPACK_IMPORTED_MODULE_1__images_deep_space_2_jpg___default.a, __WEBPACK_IMPORTED_MODULE_0__images_deep_space_1_jpg___default.a, __WEBPACK_IMPORTED_MODULE_2__images_deep_space_3_jpg___default.a, __WEBPACK_IMPORTED_MODULE_5__images_deep_space_6_jpg___default.a, __WEBPACK_IMPORTED_MODULE_3__images_deep_space_4_jpg___default.a, __WEBPACK_IMPORTED_MODULE_4__images_deep_space_5_jpg___default.a],
  YellowGasGiant: __WEBPACK_IMPORTED_MODULE_7__images_gas_giant_yellow_jpg___default.a,
  Europa: __WEBPACK_IMPORTED_MODULE_8__images_Moon_jpg___default.a,
  EuropaBump: __WEBPACK_IMPORTED_MODULE_9__images_Moon2_Bump_jpg___default.a
});
loadMusic({
  CrystalDropFall: __WEBPACK_IMPORTED_MODULE_6__sounds_music_crystal_drop_fall_mp3___default.a
});
level(0, function () {
  var _this = this;

  var stopPlaying = false;
  var audio = music.CrystalDropFall;
  audio.addEventListener('ended', function () {
    if (!stopPlaying) audio.play();
  });
  audio.play();
  this.addEventListener('destroy', function () {
    _this.tween.add('ease-in-out', 2500, function (t) {
      audio.volume = 1 - t;
    }, function () {
      stopPlaying = true;
      audio.stop();
    });
  });

  var checkGroups = function checkGroups(self, maxGroups) {
    var groups = 0;
    setTimeout(function () {
      self.progress.min = 0;
      self.progress.max = maxGroups;
      self.progress.value = 0;
      self.progress.text = maxGroups + ' TO GO';
    }, 0);
    self.board.addEventListener('destroy', function (evt) {
      groups++;

      if (groups < maxGroups) {
        self.progress.text = maxGroups - groups + ' TO GO';
      } else {
        self.progress.text = 'COMPLETE';
      }

      self.progress.value = Math.min(groups, maxGroups);

      _this.score.addScore(evt.group);

      if (groups >= maxGroups) self.board.addEventListener('validated', function (evt) {
        _this.next();
      });
    });
  };

  this.scene(function (THREE) {
    var _this2 = this;

    this.add(new THREE.AmbientLight(0xaaaaaa, 4));
    var pointLight = new THREE.PointLight(0xffffff, 1, 50);
    pointLight.position.set(-15, -15, 5);
    this.lights.add(pointLight);
    var pointLight = new THREE.PointLight(0xffffff, 1, 50);
    pointLight.position.set(15, 15, 5);
    this.lights.add(pointLight);
    var pointLight = new THREE.PointLight(0xffffff, 1, 50);
    pointLight.position.set(-15, 15, 5);
    this.lights.add(pointLight);
    var pointLight = new THREE.PointLight(0xffffff, 1, 50);
    pointLight.position.set(15, -15, 5);
    this.lights.add(pointLight);
    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(10, 10, 20);
    light.lookAt(-10, 10, -20);
    this.add(light);
    var spotLight = new THREE.SpotLight(0xffffff, 10, 100, Math.PI / 2);
    spotLight.position.set(0, 10, 10);
    spotLight.lookAt(0, 0, -40);
    this.add(spotLight);
    this.skyBox = textures.SkyBox;
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 4, 4), new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BothSides
    }));
    plane.position.set(0, 0, 40);
    this.add(plane);
    plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 4, 4), new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BothSides
    }));
    plane.position.set(0, 0, 40);
    plane.rotateY(Math.PI / 3);
    this.add(plane);
    plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 4, 4), new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BothSides
    }));
    plane.position.set(0, 0, 40);
    plane.rotateY(-Math.PI / 3);
    this.add(plane);
    var g_planet1 = new THREE.SphereGeometry(500, 128, 128);
    var m_planet1 = new THREE.MeshPhongMaterial({
      color: 0xffff00,
      specular: 0x444444,
      shininess: 10,
      map: textures.YellowGasGiant
    });
    var planet1 = new THREE.Mesh(g_planet1, m_planet1);
    planet1.position.set(-500, -250, -500);
    this.add(planet1);
    var glowMaterial1 = new THREE.ShaderMaterial({
      uniforms: {
        c: {
          type: "f",
          value: 0.0001
        },
        p: {
          type: "f",
          value: 3
        },
        glowColor: {
          type: "c",
          value: new THREE.Color(0xffaa00)
        },
        viewVector: {
          type: "v3",
          value: new THREE.Vector3(1, 1, -1).normalize()
        }
      },
      vertexShader: __WEBPACK_IMPORTED_MODULE_10__shaders_glow__["a" /* default */].vertexShader,
      fragmentShader: __WEBPACK_IMPORTED_MODULE_10__shaders_glow__["a" /* default */].fragmentShader,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    var glow_planet1 = new THREE.Mesh(g_planet1, glowMaterial1);
    glow_planet1.scale.multiplyScalar(1.05);
    this.add(glow_planet1);
    var g_planet2 = new THREE.SphereGeometry(70, 128, 128);
    var m_planet2 = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x444444,
      map: textures.Europa,
      shininess: 0.5,
      bumpMap: textures.EuropaBump,
      bumpScale: 0.5
    });
    var planet2 = new THREE.Mesh(g_planet2, m_planet2);
    planet2.position.set(-50, -70, -200);
    this.add(planet2);
    var glowMaterial2 = new THREE.ShaderMaterial({
      uniforms: {
        c: {
          type: "f",
          value: 0.0005
        },
        p: {
          type: "f",
          value: 10
        },
        glowColor: {
          type: "c",
          value: new THREE.Color(0xffffff)
        },
        viewVector: {
          type: "v3",
          value: new THREE.Vector3(1, 1, -1).normalize()
        }
      },
      vertexShader: __WEBPACK_IMPORTED_MODULE_10__shaders_glow__["a" /* default */].vertexShader,
      fragmentShader: __WEBPACK_IMPORTED_MODULE_10__shaders_glow__["a" /* default */].fragmentShader,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    var glow_planet2 = new THREE.Mesh(g_planet2, glowMaterial2);
    glow_planet2.scale.multiplyScalar(1.05);
    this.add(glow_planet2);
    var rotation = -Math.PI / 4;

    this.update = function (delta) {
      planet1.rotateZ(Math.PI / 18);
      planet1.rotateY(delta * Math.PI / 360);
      planet1.rotateZ(-Math.PI / 18);
      rotation += delta * Math.PI / 360;
      planet2.position.set(-500 + 600 * Math.cos(rotation), -70, -500 + 600 * Math.sin(rotation));
      planet2.rotateZ(-Math.PI / 18);
      planet2.rotateY(delta * Math.PI / 360);
      planet2.rotateZ(Math.PI / 18);
      glow_planet1.position.copy(planet1.position);
      glowMaterial1.uniforms.viewVector.value = planet1.position.clone();
      glowMaterial1.uniforms.viewVector.value.z *= -1;
      glowMaterial1.uniforms.viewVector.value.normalize();
      glow_planet2.position.copy(planet2.position);
      glowMaterial2.uniforms.viewVector.value = planet2.position.clone();
      glowMaterial2.uniforms.viewVector.value.z *= -1;
      glowMaterial2.uniforms.viewVector.value.normalize();

      _this2.lights.rotateZ(Math.PI * 2 * delta / 10);
    };

    this.update(0);
    this.fog = new THREE.Fog(new THREE.Color(16 / 255, 20 / 255, 31 / 255), 250, 550);
  });
  this.stage(function () {
    var nextTiles = [GlassNugget, GreenGem, BlueGem, YellowGem, PurpleGem, GreenGem, YellowGem, PurpleGem, PurpleGem, GreenDiamond, GreenGem, PurpleGem, YellowGem, YellowGem, GreenDiamond, GreenGem];
    this.board = new Board(4, 4, function () {
      return new (nextTiles.shift() || NextGem())();
    });
    checkGroups(this, 5);
  });
  this.stage(function () {
    this.board = new Board(5, 5, function () {
      return new (NextGemOrDiamond())();
    });
    checkGroups(this, 10);
  });
  this.stage(function () {
    var nextTiles = [PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond, CyanDiamond, PinkDiamond];
    this.board = new Board(6, 6, function () {
      return new (nextTiles.shift() || NextGemDiamondOrNugget())();
    });
    checkGroups(this, 15);
  });
  this.stage(function () {
    this.board = new Board(7, 7, function () {
      return new (NextGemOrDiamond())();
    });
    checkGroups(this, 20);
  });
  this.stage(function () {
    this.board = new Board(8, 8, function () {
      return new (NextGemOrDiamond())();
    });
    checkGroups(this, 30);
  });
  this.stage(function () {
    this.board = new Board(9, 9, function () {
      return new (NextGemOrDiamond())();
    });
    checkGroups(this, 50);
  });
  this.stage(function () {
    this.board = new Board(10, 10, function () {
      return new (NextGemDiamondOrNugget())();
    });
    checkGroups(this, 25);
  });
});

/***/ })
/******/ ]);