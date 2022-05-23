import styles from './index.module.css';

import React, { Component } from 'react';
import * as THREE from 'three';
import { Slider } from '../../components/Slider/Slider';
import { Selector } from '../../components/Selector/Selector';

const style = {
  height: window.innerHeight, // we can control scene size by setting container dimensions
};

const size = 1.5;

class App extends Component {
  constructor() {
    super();
    this.color = 0x156289;
  }

  componentDidMount() {
    this.sceneSetup();
    this.addCustomSceneObjects();
    this.startAnimationLoop();

    this.mount.addEventListener('resize', this.handleWindowResize);
    this.mount.addEventListener('mousedown', this.handleMouseDown, false);
    this.mount.addEventListener('mouseup', this.handleMouseUp, false);
    this.mount.addEventListener('mousemove', this.handleMouseMove, false);
  }
  handleMouseDown = (e) => {
    this.startDragPos = getMousePos(e);
    this.mouseIsDown = true;
  };
  handleMouseUp = () => {
    this.mouseIsDown = false;
  };
  handleMouseMove = (e) => {
    if (this.mouseIsDown) {
      var deltaMove = {
        x: e.offsetX - this.previousMousePosition.x,
        y: e.offsetY - this.previousMousePosition.y,
      };
      const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(toRadians(deltaMove.y * 0.2), toRadians(deltaMove.x * 0.2), 0, 'XYZ'),
      );
      this.figure.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.figure.quaternion);
    }
    this.previousMousePosition = { x: e.offsetX, y: e.offsetY };
  };

  sceneSetup = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.z = 4;
    this.camera.position.y = 2;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    // this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement); // mount using React ref
  };

  getMaterial = (color) => {
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    return material;
  };

  getCube = () => {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = this.getMaterial(this.color);
    const figure = new THREE.Mesh(geometry, material);
    figure.castShadow = true;
    figure.position.y = 2;
    figure.position.z = -1.5;
    return figure;
  };

  getPyramid = () => {
    const geometry = new THREE.CylinderGeometry(0.001, size * 1, size * 1, 4);
    const material = this.getMaterial(this.color);
    const figure = new THREE.Mesh(geometry, material);
    figure.castShadow = true;
    figure.position.y = 2;
    figure.position.z = -1.5;
    return figure;
  };

  addCustomSceneObjects = () => {
    this.bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
    this.bulbLight = new THREE.PointLight(0xffee88, 20, 100, 2);
    this.bulbMat = new THREE.MeshStandardMaterial({
      emissive: 0xffffee,
      emissiveIntensity: 1,
      color: 0x000000,
    });
    this.bulbLight.add(new THREE.Mesh(this.bulbGeometry, this.bulbMat));
    this.bulbLight.position.set(0, 2, 0);
    this.bulbLight.castShadow = true;
    this.scene.add(this.bulbLight);
    this.figure = this.getCube();
    this.scene.add(this.figure);
  };

  startAnimationLoop = () => {
    this.bulbMat.emissiveIntensity = this.bulbLight.intensity / Math.pow(0.02, 2.0); // convert from intensity to irradiance at bulb surface
    this.renderer.render(this.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
  };

  render() {
    return (
      <div>
        <div className={styles.sliders}>
          <fieldset className={styles.edges}>
            <legend>Controls</legend>
            <Selector
              onChange={(o) => {
                this.scene.remove(this.figure);
                switch (o) {
                  case 'cube':
                    this.figure = this.getCube();
                    break;
                  case 'pyramid':
                    this.figure = this.getPyramid();
                    break;
                }
                this.scene.add(this.figure);
              }}
              options={options}
            />
            <Slider
              label="Intensity"
              min={0}
              max={100}
              defaultValue={20}
              onChange={(e) => (this.bulbLight.intensity = e.target.value)}
            />
            <Slider
              label="x"
              min={-100}
              max={100}
              defaultValue={0}
              onChange={(e) => (this.bulbLight.position.x = e.target.value / 50)}
            />
            <Slider
              label="y"
              min={-100}
              max={100}
              defaultValue={0}
              onChange={(e) => (this.bulbLight.position.y = e.target.value / 50 + 2)}
            />
            <Slider
              label="z"
              min={-100}
              max={100}
              defaultValue={0}
              onChange={(e) => (this.bulbLight.position.z = e.target.value / 50)}
            />
            <input
              style={{ width: '100%' }}
              type="color"
              defaultValue={'#156289'}
              onChange={(e) => {
                const rgb = toRGB(e.target.value.slice(1, e.target.value.length));
                this.color = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
                this.figure.material = this.getMaterial(this.color);
              }}
            />
          </fieldset>
        </div>
        <div style={style} ref={(ref) => (this.mount = ref)} />
      </div>
    );
  }
}

export default App;

const getMousePos = (evt) => {
  return { x: evt.clientX, y: evt.clientY };
};

const toRadians = (angle) => {
  return angle * (Math.PI / 180);
};

const options = {
  cube: 'Cube',
  pyramid: 'Pyramid',
};

const toRGB = (value) => {
  var aRgbHex = value.match(/.{1,2}/g);
  var aRgb = [parseInt(aRgbHex[0], 16), parseInt(aRgbHex[1], 16), parseInt(aRgbHex[2], 16)];
  return aRgb;
};
