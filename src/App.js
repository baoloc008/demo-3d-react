import './app.css';
import React, { Component } from 'react';

const { THREE, Stats, WEBGL } = window;

class App extends Component {
  componentDidMount() {
    if (WEBGL.isWebGLAvailable() === false) {
      document.body.appendChild(WEBGL.getWebGLErrorMessage());
    }
    var container, stats;
    var camera, scene, renderer, composer, controls;
    var loader;
    // Initialize Three.JS
    init();
    loader = new THREE.SEA3D({
      autoPlay: true, // Auto play animations
      container: scene, // Container to add models
      progressive: true // Progressive download
    });
    loader.onComplete = function() {
    };
    loader.load('./models/mascot.draco.tjs.sea');
    function init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x333333);
      container = document.createElement('div');
      document.getElementById('root').appendChild(container);
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.set(1000, 1000, 1000);
      camera.lookAt(0, 0, 0);
      controls = new THREE.OrbitControls(camera);
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
      stats = new Stats();
      container.appendChild(stats.dom);
      // post-processing
      composer = new THREE.EffectComposer(renderer);
      var renderPass = new THREE.RenderPass(scene, camera);
      var copyPass = new THREE.ShaderPass(THREE.CopyShader);
      composer.addPass(renderPass);
      var vh = 1.4, vl = 1.2;
      var colorCorrectionPass = new THREE.ShaderPass(THREE.ColorCorrectionShader);
      colorCorrectionPass.uniforms['powRGB'].value = new THREE.Vector3(vh, vh, vh);
      colorCorrectionPass.uniforms['mulRGB'].value = new THREE.Vector3(vl, vl, vl);
      composer.addPass(colorCorrectionPass);
      var vignettePass = new THREE.ShaderPass(THREE.VignetteShader);
      vignettePass.uniforms['darkness'].value = 1.0;
      composer.addPass(vignettePass);
      composer.addPass(copyPass);
      copyPass.renderToScreen = true;
      // events
      window.addEventListener('resize', onWindowResize, false);
    }
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      composer.setSize(window.innerWidth, window.innerHeight);
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    var clock = new THREE.Clock();
    function animate() {
      var delta = clock.getDelta();
      requestAnimationFrame(animate);
      THREE.SEA3D.AnimationHandler.update(delta);
      render(delta);
      stats.update();
    }
    function render(dlt) {
      composer.render(dlt);
    }
    animate();
  }
  render() {
    return <div />;
  }
}

export default App;
