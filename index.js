/////////////////////////////////////////////////////////////////////////
///// IMPORT

import * as THREE from 'three'
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {RGBELoader}   from 'three/examples/jsm/loaders/RGBELoader'
import {GroundProjectedSkybox} from 'three/examples/jsm/objects/GroundProjectedSkybox'
// import studio from '@theatre/studio'
import core, { onChange } from '@theatre/core'
import {getProject,types} from '@theatre/core'
import { LoadingManager } from 'three/src/loaders/LoadingManager'
import projectState from './static/project-animation.json'

// Initialize the studio module
// studio.initialize()
let project;

      project = getProject("Practicing Theatre.js" , {state : projectState} )









let startBtn = document.querySelector(".startBtn")

const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {};

manager.onLoad = function () {
    startBtn.style.display = "block";
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    document.querySelector(".preloader h1").innerText =
        ((itemsLoaded / itemsTotal) * 100).toFixed(0) + "%";
};

manager.onError = function (url) {
    console.log("There was an error loading " + url);
};






/////////////////////////////////////////////////////////////////////////
//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader(manager)
const loader = new GLTFLoader(manager)
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

/////////////////////////////////////////////////////////////////////////
///// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.createElement('div')
document.body.appendChild(container)

/////////////////////////////////////////////////////////////////////////
///// SCENE CREATION
const scene = new THREE.Scene()
scene.background = new THREE.Color('#000')

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG
const renderer = new THREE.WebGLRenderer({ antialias: true}) // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
renderer.outputEncoding = THREE.sRGBEncoding // set color encoding
container.appendChild(renderer.domElement) // add the renderer to html div
renderer.toneMapping = THREE.ReinhardToneMapping

/////////////////////////////////////////////////////////////////////////
///// CAMERAS CONFIG
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000)

scene.add(camera)

/////////////////////////////////////////////////////////////////////////
///// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
    renderer.setPixelRatio(2)
})

/////////////////////////////////////////////////////////////////////////
///// CREATE ORBIT CONTROLS
// const controls = new OrbitControls(camera, renderer.domElement)

/////////////////////////////////////////////////////////////////////////
///// SCENE LIGHTS
const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82)
scene.add(ambient)

const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96)
sunLight.position.set(-69,44,14)
scene.add(sunLight)

















const rgbloader= new RGBELoader(manager);
rgbloader.load('./newenv.hdr' , (envMap)=>{

	envMap.mapping = THREE.EquirectangularReflectionMapping;

				let skybox = new GroundProjectedSkybox( envMap );
				skybox.scale.setScalar( 100 );
				scene.add( skybox );

				scene.environment = envMap;

})





/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
let model;
loader.load('./car.glb', function (gltf) {
model = gltf.scene
model.scale.set(4,4,4)
    scene.add(model)
    camera.lookAt(model.position)


let carBody = gltf.scene.getObjectByName('carbody')
 let bodyColor = carBody.material.color

 const changeCol = sheet.object("Car Color" , {
    col : types.rgba(),

 })

 changeCol.onValuesChange((v)=>{
    carBody.material.color = new THREE.Color(v.col.toString())

 })



const colors = document.querySelectorAll('.color')

for (const color of colors) {
    color.addEventListener('click' , (e)=>{
        const clickedColor = color.style.backgroundColor
carBody.material.color = new THREE.Color(clickedColor.toString())

    })
}


const container = document.querySelector('.container')


const opacity = sheet.object("Container Opacity" , {
    op : types.number(0,{range:[0,1]})
})


opacity.onValuesChange( (o)=>{
container.style.opacity =  o.op
})

})



const planeGeometry = new THREE.PlaneGeometry(2,1,1)
const planeMaterial = new THREE.MeshBasicMaterial({
    color : 'black',
    side : THREE.DoubleSide,
    transparent : true,
    // opacity : 0,
})



const plane = new THREE.Mesh(planeGeometry,planeMaterial)
plane.position.set(0,0,-1)
camera.add(plane)







// Theatre.JS /////////////////////////////////////////////////////////////////////////////

const sheet = project.sheet("Cinematic Shot")
camera.position.set( -12.33, 10.0299, 11.690)
camera.rotation.set(-3.83,3.8731, 2.43)
const craneCam = sheet.object("Crane Cam", {

    position : types.compound({
        x : types.number(34,{nudgeMultiplier: 0.01,range : [-50 , 50]}),
        y : types.number(16,{nudgeMultiplier: 0.01,range : [-50 , 50]}),
        z : types.number(-5,{nudgeMultiplier: 0.01,range : [-50 , 50]}),
    }),
    rotation : types.compound({
        xR : types.number(0,{nudgeMultiplier: 0.01,range : [-Math.PI *2 , Math.PI*2]}),
        yR : types.number(0,{nudgeMultiplier: 0.01,range : [-Math.PI *2, Math.PI*2]}),
        zR : types.number(0,{nudgeMultiplier: 0.01,range : [-Math.PI *2, Math.PI*2]}),
    }),

})

const planeOpacity = sheet.object("Plane Opacity", {
    val : types.number(0,{nudgeMultiplier: 0.01,range : [0 , 1]})
})

planeOpacity.onValuesChange( (op)=>{
    planeMaterial.opacity = op.val

})



craneCam.onValuesChange( (value)=>{
    const {x,y,z} = value.position
    camera.position.set(x,y,z)

    const {xR,yR,zR} = value.rotation

    camera.rotation.set(xR,yR,zR)
})

let controls;
function SettingOrbitControls() {
     controls = new OrbitControls(camera,renderer.domElement)
    scene.add(controls)
    controls.enableDamping = true
    controls.maxPolarAngle = Math.PI/2.1
}




onChange(sheet.sequence.pointer.position, (position)=>{
console.log("Position =" , position)
if (position === 19.71) {
    console.log("CHECKED")
    SettingOrbitControls()
}
})







startBtn.addEventListener('click' , ()=>{
    sheet.sequence.play({iterationCount: 1, range:[0,20]})
    document.querySelector(".preloader").style.transform = "translate(0 , -100%)"
   
})



/////////////////////////////////////////////////////////////////////////
//// RENDER LOOP FUNCTION
function rendeLoop() {


if (controls) {
    controls.update()
}
    // controls.update() // update orbit controls

    renderer.render(scene, camera) // render the scene using the camera

    requestAnimationFrame(rendeLoop) //loop the render function
    
}

rendeLoop() //start rendering