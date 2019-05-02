import React, { Component } from 'react';
import * as THREE from 'three';
// import * as OBJLoader from 'three-obj-loader';
// import MTLLoader from 'three-mtl-loader';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'


import OrbitControls from 'three-orbitcontrols'


 // right 
// Left
// Top
 //Bottom
 // Front
 // Back
import image1 from './../../assets/elbrus_rt.jpg';
import image2 from './../../assets/elbrus_lf.jpg';
import image3 from './../../assets/elbrus_up.jpg';
import image4 from './../../assets/elbrus_dn.jpg';
import image5 from './../../assets/elbrus_bk.jpg';
import image6 from './../../assets/elbrus_ft.jpg';
import batObj from './../../assets/10485_Baseball_bat_v1_L3.123c11f3bcc3-8bc7-42dc-bb4f-32df50d68d2f/10485_Baseball_bat_v1_max2011_iteration-2.obj'
import ballObj from './../../assets/ball/10483_baseball_v1_L3.obj'
import texture from './../../assets/10485_Baseball_bat_v1_L3.123c11f3bcc3-8bc7-42dc-bb4f-32df50d68d2f/10485_Baseball_bat_v1_max2011_iteration-2.mtl'
import batTextureImage from './../../assets/10485_Baseball_bat_v1_L3.123c11f3bcc3-8bc7-42dc-bb4f-32df50d68d2f/textureImage.jpg'
import StadiumModel from './../../assets/3d-model.obj';
import baseBallJSON from './../../assets/baseball.json';

OBJLoader(THREE);

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
    this.camera.position.x = 1
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

    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);

    // var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);


    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.50);

    var dirLight = new THREE.DirectionalLight(0xffffff, 0.50);

    this.scene.add(ambientLight)
    // this.scene.add(directionalLight);


    this.THREE = THREE;


    //Ball
    var ballComponent = new THREE.BoxGeometry(100, 100, 100);
    var cubeMaterial = [
      new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(image1), side: THREE.DoubleSide }), // right 
      new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(image2), side: THREE.DoubleSide }), // Left
      new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(image3), side: THREE.DoubleSide }), // Top
      new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(image4), side: THREE.DoubleSide }),  //Bottom
      new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(image5), side: THREE.DoubleSide }),  // Front
      new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load(image6), side: THREE.DoubleSide }),  // Back
    ];
    var materialNew = new THREE.MeshFaceMaterial(cubeMaterial);
    this.ballComponentMesh = new THREE.Mesh(ballComponent, materialNew);
    this.scene.add(this.ballComponentMesh);


    var mltLoader = new MTLLoader();
    var objLoader = new OBJLoader();
    // texture
    // batTextureImage
    mltLoader.load(texture, (material) => {
        material.preload()
        objLoader.setMaterials(material)
        objLoader.load( batObj, (object) => {
            object.position.y -= 20;
            this.scene.add(object);
        });
    })

    
    this.start();
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }


  animate() {
    //   this.ballComponentMesh.rotation.z += 1.5
    //   this.ballComponentMesh.rotation.x += 1.5
      this.renderScene()
      this.frameId = window.requestAnimationFrame(() => this.animate())
    }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }
  start = () => {
    this.renderScene();
    this.animate();
  }
  render() {
    return (
      <div >
        <div
          style={{ width: window.innerWidth, height: window.innerHeight }}
          ref={(mount) => { this.mount = mount }}
        />
      </div>

    )
  }
}
export default ThreeScene