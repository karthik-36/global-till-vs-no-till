//import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'


import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'


document.getElementById("population").addEventListener("click", checkClickPop);
document.getElementById("temprature").addEventListener("click", checkClickTemp);
document.getElementById('popSlider').style.display = 'none'
document.getElementById('tempLegend').style.display = 'none'
document.getElementById('tempSlider').style.display = 'none'
document.getElementById('popLegend').style.display = 'none'

const centerHolder = document.getElementById('centerHolder');


var mainMode = 'population';
function checkClickPop(mode) {

  centerHolder.remove();
  console.log("population clicked");

  document.getElementById('popSlider').style.display = 'none'
  document.getElementById('tempSlider').style.display = ''

  document.getElementById('popLegend').style.display = ''
  document.getElementById('tempLegend').style.display = 'none'

  let radio = document.getElementById('temprature')
  radio.checked = false;
  radio = document.getElementById('population')
  radio.checked = true;
  mainMode = 'population';


  createPop(2021);
  scene.remove(groupCities2);
  console.log('Executing action ' + mainMode)
}


function checkClickTemp(mode) {

  centerHolder.remove();
  console.log("temp clicked");

  document.getElementById('popSlider').style.display = ''
  document.getElementById('tempSlider').style.display = 'none'


  document.getElementById('popLegend').style.display = 'none'
  document.getElementById('tempLegend').style.display = ''

  let radio = document.getElementById('population')
  radio.checked = false;
  radio = document.getElementById('temprature')
  radio.checked = true;
  mainMode = 'temprature';


  createTemp(12);
  scene.remove(groupCities);
  console.log('Executing action ' + mainMode)

}



let tempMap = new Map();



for (let i = allTemprature.length - 1; i != -1; i--) {
  let postFix = parseInt(allTemprature[i].dt.split("-")[1]);
  if (!tempMap.has(allTemprature[i].City + "_" + postFix)) {
    tempMap.set(allTemprature[i].City + "_" + postFix, allTemprature[i])
  }

}

console.log(tempMap);



allCountries = allCountries.ref_country_codes;

let map = new Map();

for (let i = 0; i < population.length; i++) {

  map.set(population[i].country, population[i].population);

}




for (let i = 0; i < allCountries.length; i++) {

  if (map.has(allCountries[i].country)) {
    allCountries[i].population = map.get(allCountries[i].country)
  }

}



var groups = {
  main: null, // A group containing everything
  globe: null, // A group containing the globe sphere
  globeDots: null, // A group containing the globe dots
  lines: null, // A group containing the lines between each country
};

var props = {

  globeRadius: 200, // Radius of the globe (used for many calculations)
  colours: {
    // Cache the colours
    globeDots: 'rgb(61, 137, 164)', // No need to use the Three constructor as this value is used for the HTML canvas drawing 'fillStyle' property
    lines: new THREE.Color('#eeff5d'),
    lineDots: new THREE.Color('#18FFFF')
  },
  alphas: {
    // Transparent values of materials
    globe: 0.4,
    lines: 0.5
  }
};


const scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(
  75, innerWidth / innerHeight,
  0.1,
  1000
);

var list;

const renderer = new THREE.WebGLRenderer({
  antialias: true
})


const controls = new OrbitControls(camera, renderer.domElement)
controls.enablePan = false;
controls.minDistance = 7;
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)


document.body.appendChild(renderer.domElement)



const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load('./images/earthmap.jpg')
      }
    }
  })
)

// atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5.3, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide

  })
)

atmosphere.scale.set(1.2, 1.2, 1.2);


scene.add(atmosphere);
camera.position.z = 15;


const mouse = {
  x: undefined,
  y: undefined
}

const group = new THREE.Group()
group.add(sphere)



const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})

const starVertices = [];

for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 2000;
  starVertices.push(x, y, z);
}
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = Math.random() * 2000;
  starVertices.push(x, y, z);
}


starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))

const stars = new THREE.Points(starGeometry, starMaterial);

scene.add(stars);



// points individual

let mesh = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.05, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

let mesh1 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.05, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

let mesh2 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.05, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)





function getCurve(p1, p2) {


  let v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
  let v2 = new THREE.Vector3(p2.x, p2.y, p2.z);

  let points = [];
  for (let i = 0; i < 20; i++) {
    let p = new THREE.Vector3().lerpVectors(v1, v2, i / 20);
    points.push(p);
    //console.log(p);
  }

  let path = new THREE.CatmullRomCurve3(points);

  const geometry = new THREE.TubeGeometry(path, 4, 0.05, 4, false);
  const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const mesh = new THREE.Mesh(geometry, material);

  groupCities.add(mesh);
  //scene.add(mesh);


}


function convertLatLngToCordinate3(lat, lng, radius) {
  const PI180 = Math.PI / 180.0;
  var phi = (90 - lat) * PI180;
  var theta = (360 - lng) * PI180;

  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
}

// let point1 = {
//   lat: 34.0522,
//   lng: -118.2437
// }

// let point2 = {
//   lat: 50.4501,
//   lng: 30.5234
// }

// let point3 = {
//   lat: 20.5937,
//   lng: -78.9629

// }

// let pos = convertLatLngToCordinate3(point1.lat, point1.lng, 5.1)
// let pos1 = convertLatLngToCordinate3(point2.lat, point2.lng, 5.1)
// let pos2 = convertLatLngToCordinate3(point3.lat, point3.lng, 5.1)

// //console.log(pos);

// mesh.position.set(pos.x, pos.y, pos.z)
// mesh1.position.set(pos1.x, pos1.y, pos1.z)
// mesh2.position.set(pos2.x, pos2.y, pos2.z)

//getCurve(pos,pos1)

var groupCities = new THREE.Group()

////

function convertRange(value, r1, r2) {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}


let createPop = function (year) {

  year = convertRange(year, [1950, 2021], [0.3, 1]);


  scene.remove(groupCities);
  groupCities = new THREE.Group();
  for (let i = 0; i < allCountries.length; i++) {
    let height = allCountries[i].population;

    if (height == null) {
      height = 0;
    }

    height = convertRange(height, [0, 1500000000], [0.05, 4]);

    let newMesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.05, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x0033ff })
    )

    let position = convertLatLngToCordinate3(allCountries[i].latitude, allCountries[i].longitude, 5.01)


    newMesh.position.set(position.x, position.y, position.z)
    groupCities.add(newMesh);



    let newMesh2 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.05, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x00ccaa })
    )

    let position2 = convertLatLngToCordinate3(allCountries[i].latitude, allCountries[i].longitude, 5.01 + (height * year))
    newMesh2.position.set(position2.x, position2.y, position2.z)
    groupCities.add(newMesh2);


    getCurve(position, position2);
  }
  scene.add(groupCities);
}



var groupCities2 = new THREE.Group()

let center = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(0.2, 0.2),
  new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0.99 })
)

center.position.set(0, 0, 0);
groupCities2.add(center);

let createTemp = function (year) {


  scene.remove(groupCities2);
  groupCities2 = new THREE.Group();

  for (const [key, value] of tempMap.entries()) {
    // console.log(key, value);
    if (year == key.split("_")[1]) {



      let realTemp = value.AverageTemperature;

      let red = parseInt(convertRange(realTemp, [-20, 50], [0, 255]));

      let blue = parseInt(convertRange(realTemp, [-20, 50], [255, 0]));


      //  if(red > 150){
      //   blue = 0
      //  }
      //console.log(key,"red",red,"blue",blue);
      const white = new THREE.Color('rgb(' + red + ',0,' + blue + ')');

      let newMesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(0.2, 0.2),
        new THREE.MeshBasicMaterial({ color: white, side: THREE.DoubleSide, transparent: true, opacity: 0.78 })
      )



      let position = convertLatLngToCordinate3(value.Latitude, value.Longitude, 5.0)
      // //("pos1 " + allCountries[i].latitude  + "  "+  allCountries[i].longitude  );
      newMesh.position.set(position.x, position.y, position.z);

      groupCities2.add(newMesh);
      newMesh.lookAt(center.position);
    }
  }
  scene.add(groupCities2)
}

//createPop(2021);
//createTemp(2013);
scene.add(group)

function animate() {

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  //sphere.rotation.y += 0.001;
  //groupCities.rotation.y += 0.001;
  //group.rotation.y = mouse.x;
  //group.rotation.x = mouse.y;
}




// function createListElements() {
//   list = document.getElementsByClassName('js-list')[0];
//   var pushObject = function (coordinates, target) {
//     // Create the element
//     var element = document.createElement('li');
//     var innerContent;
//     //var targetCountry = data.countries[target];
//     var targetCountry = allCountries[target]; // REPLACEMENT
//     element.innerHTML = '<span class="text">' + targetCountry.country + '</span>'; //country name
//     element.className += targetCountry.country;
//     //element.span.className += targetCountry.name;
//     var object = {
//       position: coordinates,
//       element: element
//     };

//     // Add the element to the DOM and add the object to the array
//     list.appendChild(element);
//     elements[target] = object;
//   };

//   // Loop through each country line
//   var i = 0;
//   for (var x = 0; x < allCountries.length; x++) { //var country in data.countries
//     //	var coordinates = groups.globeDots.geometry.vertices[x];
//     //	pushObject(coordinates, x);
//   }
// }



var slider = document.getElementById('myRange')
var output = document.getElementById('demo')
output.innerHTML = "<b> 2012-" + slider.value + "-01" + " </b>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    Max : 2012-12-01";

slider.oninput = function () {
  output.innerHTML = "<b> 2012-" + this.value + "-01" + " </b>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    Max : 2012-12-01";
  createTemp(this.value);

}



var slider2 = document.getElementById('myRange2')
var output2 = document.getElementById('demo2')
output2.innerHTML = "<b>" + slider2.value + " </b>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      Max : 2021"

slider2.oninput = function () {
  output2.innerHTML = "<b>" + this.value + " </b>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     Max : 2021"
  createPop(this.value);

}


let cameraAnimate = function (lat , lng , camera) {
  var targetPosition = convertLatLngToCordinate3(lat , lng, 200);
  // +20 so the point is not at the center, otherwise the curve will look flat
  targetPosition.z += 20;

  // get the current camera position

  console.log(camera.position);
  const { x, y, z } = camera.position
  const start = new THREE.Vector3(x, y, z)

  // move camera to the target
  const point = targetPosition
  const camDistance = camera.position.length()
  camera.position
    .copy(point)
    .normalize()
    .multiplyScalar(camDistance)

  // save the camera position
  const { x: a, y: b, z: c } = camera.position

  // invert back to original position
  camera.position
    .copy(start)
    .normalize()
    .multiplyScalar(camDistance)
  // animate from start to end
  
  TweenMax.to(camera.position, 1, {
    x: a, y: b, z: c, onUpdate: () => {
      console.log(center);
      camera.lookAt(center.position);
    }
  })
}

//cameraAnimate(20.5937, 78.9629 , camera );
const selectElement = document.getElementById('country');
console.log(selectElement);
selectElement.addEventListener('change', (event) => {

  let val = event.target.value;
  for(let i = 0 ; i < allCountries.length ; i++){
  //  console.log(allCountries[i].alpha2);
    if(allCountries[i].alpha2 == val){
      //alert("found" + allCountries[i]);
   //   console.log(allCountries[i]);
      cameraAnimate(allCountries[i].latitude, allCountries[i].longitude , camera );
      break;
    }
  }

});

animate();

addEventListener('mousemove', () => {

  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / innerHeight) * 2 + 1;

})


























