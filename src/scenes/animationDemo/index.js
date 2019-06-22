import React, { Component } from 'react';
import * as THREE from 'three';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
import OrbitControls from 'three-orbitcontrols'
import batObj from './../../assets/10485_Baseball_bat_v1_L3.123c11f3bcc3-8bc7-42dc-bb4f-32df50d68d2f/10485_Baseball_bat_v1_max2011_iteration-2.obj'
import ballObj from './../../assets/ball/10483_baseball_v1_L3.obj'
import texture from './../../assets/10485_Baseball_bat_v1_L3.123c11f3bcc3-8bc7-42dc-bb4f-32df50d68d2f/10485_Baseball_bat_v1_max2011_iteration-2.mtl'
import batTextureImage from './../../assets/10485_Baseball_bat_v1_L3.123c11f3bcc3-8bc7-42dc-bb4f-32df50d68d2f/textureImage.jpg'

OBJLoader(THREE);
// MTLLoader(THREE);
class ThreeScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: '',
      started: false,
      bowling: true
    }
  }
  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    //ADD SCENE
    this.scene = new THREE.Scene()
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.camera.position.z = 100
    this.camera.position.y = 30
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor('#FA0')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

    window.addEventListener('resize', () => {
      var width = window.innerWidth;
      var height = window.innerHeight;
      this.renderer.setSize(width, height)
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    })
    new OrbitControls(this.camera, this.renderer.domElement)
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.50);
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.50);

    this.scene.add(hemiLight)
    this.scene.add(dirLight);


    this.THREE = THREE;
    const loader2 = new this.THREE.OBJLoader();
    loader2.load(
      // resource URL
      ballObj,
      // called when resource is loaded
      (object) => {
        this.ballComponentMesh = object;
        // this.ballComponentMesh.rotation.y = -1.70;
        // pivotPoint.add(this.ballComponentMesh);
        this.ballComponentMesh.position.x = 17;
        this.ballComponentMesh.position.z = -200;
        this.scene.add(this.ballComponentMesh);
      },
      // called when loading is in progresses
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      // called when loading has errors
      function (error) {
        console.log('An error happened', error);
      }
    );
    let mtlLoader = new MTLLoader();
    this.loader = new this.THREE.OBJLoader();
    mtlLoader.setPath( batTextureImage );
    mtlLoader.load(texture, (materials) => {
      materials.preload()
      this.loader.setMaterials(materials)
    })
    this.loader.load(
      batObj,
      // called when resource is loaded
      (object) => {
        let batComponent = object;
        this.batComponentMesh = batComponent;
        this.batComponentMesh.rotation.y = -1.0
        this.batComponentMesh.rotation.x = 0
        this.batComponentMesh.rotation.z = 0       
        this.scene.add(this.batComponentMesh);

      },
      // called when loading is in progresses
      function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

      },
      // called when loading has errors
      function (error) {

        console.log('An error happened');

      }
    );
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  batSwingHit = () => {
    if (this.batComponentMesh.rotation.y > -1) {
      this.batComponentMesh.rotation.y -= 0.4
      this.renderScene()
      this.frameId = window.requestAnimationFrame(this.batSwingHit)
    } else {
      this.batComponentMesh.rotation.y = -1
    }
  }

  batSwing = () => {
    // this.pivotPoint.rotation.y += 0.05;
    if (this.batComponentMesh.rotation.y <= 1) {
      this.batComponentMesh.rotation.y += 0.1
      this.batComponentMesh.rotation.x -= -.03
      this.batComponentMesh.rotation.z -= 0.01
      this.renderScene()
      this.frameId = window.requestAnimationFrame(this.batSwing)
    }
    else {
      this.batComponentMesh.rotation.x = 0
      this.batComponentMesh.rotation.z = 0 
      this.batSwingHit();
    }
  }

  animateBallSwing(ballType) {
    this.setState({
      bowling: false
    })
    if (this.ballComponentMesh.position.z < -10) {
      this.ballComponentMesh.position.z += 1.5
      this.ballComponentMesh.position.x += ballType
      this.renderScene()
      this.frameId = window.requestAnimationFrame(() => this.animateBallSwing(ballType))
    } else {
      if (this.batComponentMesh.rotation.y != -1) {
        this.ballHitSwing(ballType)
      } else {
        this.ballComponentMesh.position.z = -200;
        this.ballComponentMesh.position.x = 17;
        this.ballComponentMesh.position.y = 0;
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.stop)
        this.setState({
          score: 'strike',
          bowling: true
        })
      }
    }
  }

  ballHitSwing(ballType) {
    if (this.ballComponentMesh.position.z > -200) {
      this.ballComponentMesh.position.z -= 0.7
      this.ballComponentMesh.position.y += 7 * ballType
      this.ballComponentMesh.position.x -= 100 * ballType

      this.renderScene()
      this.frameId = window.requestAnimationFrame(() => this.ballHitSwing(ballType))
    } else {
      this.ballComponentMesh.position.z = -200;
      this.ballComponentMesh.position.x = 17;
      this.ballComponentMesh.position.y = 0;
      this.renderScene()
      this.frameId = window.requestAnimationFrame(this.stop)
      this.setState({
        score: 'Home Run',
        bowling: true
      })
    }
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }
  start = () => {
    this.renderScene();
    this.setState({
      started: true
    })
  }
  render() {
    return (
      <div >
        <div
          style={{ width: window.innerWidth, height: window.innerHeight - 120 }}
          ref={(mount) => { this.mount = mount }}
        />
       {!this.state.started && <div style={{ justifyContent: 'space-around', display: 'flex' }}>
          <button style={{ fontSize: 20, padding: 20 }} onClick={() => this.props.history.push('/location')}>
              MAP
          </button>
         <button style={{ fontSize: 20, padding: 20 }} onClick={this.start}>
              START NEW GAME
          </button>
          <button style={{ fontSize: 20, padding: 20 }} onClick={() => this.props.history.push('/model')}>
              MODEL
          </button>
          </div>}
        {this.state.started &&
          <div style={{ justifyContent: 'center', display: 'flex' }}>
             { this.state.bowling ?<div> <button style={{ fontSize: 20, padding: 20 }} onClick={() => this.animateBallSwing(0.015)}>1</button>
            <button style={{ fontSize: 20, padding: 20 }} onClick={() => this.animateBallSwing(0.000)}>2</button>
            <button style={{ fontSize: 20, padding: 20 }} onClick={() => this.animateBallSwing(-0.015)}>3</button></div>:
            <button style={{ fontSize: 20, padding: 20 }} onClick={this.batSwing}>HIT</button>}
          </div>}
          <div style={{ fontSize: 20,display: 'flex', justifyContent: 'center', color: this.state.score == 'strike' ? 'red' : null }}>{this.state.score} </div>
      </div>

    )
  }
}
export default ThreeScene;