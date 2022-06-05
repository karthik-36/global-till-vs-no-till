//import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'


import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'


document.getElementById("populationRadio").addEventListener("click", checkClickPop);
document.getElementById("tempratureRadio").addEventListener("click", checkClickTemp);
document.getElementById('popSlider').style.display = 'none'
document.getElementById('tempLegend').style.display = 'none'
document.getElementById('tempSlider').style.display = 'none'
document.getElementById('popLegend').style.display = 'none'

const centerHolder = document.getElementById('centerHolder');
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedArea = null;
var countryDisplay = null;
var populationDisplay = null;
var cityDisplay= null;
var tempratureDisplay = null;



window.addEventListener('click', onDocumentMouseDown, false);

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function onDocumentMouseDown(event) {

  event.preventDefault();

  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);


  console.log(mainMode);

  var intersects = raycaster.intersectObjects(scene.children);


  if (mainMode == 'population') {
    if (intersects.length > 0) {
      console.log(intersects);
      let name = document.getElementById("countryDisplay");
      let population = document.getElementById("populationDisplay");
      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name != '') {
          countryDisplay = intersects[i].object.name;
          populationDisplay = intersects[i].object.population;
          break;
        }
      }

      if (countryDisplay != null) {
        name.innerHTML = countryDisplay;
        population.innerHTML = numberWithCommas(parseInt(populationDisplay));
      }


    }
  } else if (mainMode == 'temprature') {
    if (intersects.length > 0) {
      console.log(intersects);
      let city = document.getElementById("countryDisplay");
      let temprature = document.getElementById("populationDisplay");
      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.City != '') {
          cityDisplay = intersects[i].object.city;
          tempratureDisplay = intersects[i].object.temprature;
          break;
        }
      }

      if (cityDisplay != null) {
        city.innerHTML = cityDisplay;
        temprature.innerHTML = tempratureDisplay + " °C";
      }


    }


  }

}

var mainMode = 'population';
function checkClickPop(mode) {

  centerHolder.remove();

  document.getElementById('info').style.display = 'block'
  document.getElementById('popSlider').style.display = 'none'
  document.getElementById('tempSlider').style.display = ''

  document.getElementById('popLegend').style.display = ''
  document.getElementById('tempLegend').style.display = 'none'


  document.getElementById('countryCity').innerHTML = "Country";
  document.getElementById('populationTemp').innerHTML = "Population";

  document.getElementById('countryDisplay').innerHTML = "-----";
  document.getElementById('populationDisplay').innerHTML = "-----";



  let radio = document.getElementById('tempratureRadio')
  radio.checked = false;
  radio.setAttribute("style", "background : #FFFFF;");
  radio = document.getElementById('populationRadio')
  radio.setAttribute("style", "background : #4CAF50;   outline : 2px dashed rgb(96, 255, 117);");
  radio.checked = true;


  //  let radio = document.getElementById('populationRadio')
  // radio.setAttribute("checked" , true);
  mainMode = 'population';


  createPop(2021);
  scene.remove(groupCities2);

}


function checkClickTemp(mode) {

  centerHolder.remove();

  countryDisplay = null;
  populationDisplay = null;
  document.getElementById('info').style.display = 'block'
  document.getElementById('popSlider').style.display = ''
  document.getElementById('tempSlider').style.display = 'none'


  document.getElementById('popLegend').style.display = 'none'
  document.getElementById('tempLegend').style.display = ''



  document.getElementById('countryCity').innerHTML = "City";
  document.getElementById('populationTemp').innerHTML = "Temprature";



  document.getElementById('countryDisplay').innerHTML = "-----";
  document.getElementById('populationDisplay').innerHTML = "-----";

  // <h5 id = "countryCity"> country </h5>
  // <h3 id = "countryDisplay"> ----- </h3>
  // <h5 id = "populationTemp"> population </h5>
  // <h3 id = "populationDisplay"> ----- </h3>


  let radio = document.getElementById('populationRadio')
  radio.setAttribute("style", "background : #FFFFF;");
  radio = document.getElementById('tempratureRadio')
  radio.setAttribute("style", "background : #4CAF50;   outline : 2px dashed rgb(96, 255, 117);");
  radio.checked = true;

  mainMode = 'temprature';


  createTemp(12);
  scene.remove(groupCities);


}



let tempMap = new Map();



for (let i = allTemprature.length - 1; i != -1; i--) {
  let postFix = parseInt(allTemprature[i].dt.split("-")[1]);
  if (!tempMap.has(allTemprature[i].City + "_" + postFix)) {
    tempMap.set(allTemprature[i].City + "_" + postFix, allTemprature[i])
  }
}





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





function getCurve(p1, p2, country, population) {


  let v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
  let v2 = new THREE.Vector3(p2.x, p2.y, p2.z);

  let points = [];
  for (let i = 0; i < 20; i++) {
    let p = new THREE.Vector3().lerpVectors(v1, v2, i / 20);
    points.push(p);

  }

  let path = new THREE.CatmullRomCurve3(points);

  const geometry = new THREE.TubeGeometry(path, 4, 0.05, 4, false);
  const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const mesh = new THREE.Mesh(geometry, material);

  groupCities.add(mesh);
  mesh.name = country;
  mesh.population = population;

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



var groupCities = new THREE.Group()

////

function convertRange(value, r1, r2) {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}


let createPop = function (year) {

  year = convertRange(year, [1950, 2021], [0.27, 1]);
  let name = document.getElementById("countryDisplay");
  let population = document.getElementById("populationDisplay");

  scene.remove(groupCities);
  groupCities = new THREE.Group();
  for (let i = 0; i < allCountries.length; i++) {
    let height = allCountries[i].population;

    if (height == null) {
      height = 0;
    }

    height = convertRange(height, [0, 1400000000], [0.15, 3.8]);

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

    //newMesh2.callback = function() { console.log( this.name ); }


    let finalPop = allCountries[i].population * year;
    newMesh.name = allCountries[i].country;
    newMesh2.name = allCountries[i].country;
    newMesh.population = finalPop;
    newMesh2.population = finalPop;

    // var  countryDisplay = null;
    // var  populationDisplay = null;


    if (countryDisplay == allCountries[i].country) {
      name.innerHTML = countryDisplay;
      population.innerHTML = numberWithCommas(parseInt(finalPop));
    }


    getCurve(position, position2, allCountries[i].country, finalPop);
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

  let city = document.getElementById("countryDisplay");
  let temprature = document.getElementById("populationDisplay");
  city.innerHTML = "-----";
  temprature.innerHTML = "-----";


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

      newMesh.city = value.City;
      newMesh.temprature = realTemp;

      if(cityDisplay == value.City){
        city.innerHTML = value.City;
        temprature.innerHTML = realTemp + " °C";
      }

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


let cameraAnimate = function (lat, lng, camera) {
  var targetPosition = convertLatLngToCordinate3(lat, lng, 200);
  // +20 so the point is not at the center, otherwise the curve will look flat
  targetPosition.z += 20;

  // get the current camera position


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

      camera.lookAt(center.position);
    }
  })
}

//cameraAnimate(20.5937, 78.9629 , camera );
const selectElement = document.getElementById('country');

selectElement.addEventListener('change', (event) => {

  let val = event.target.value;
  for (let i = 0; i < allCountries.length; i++) {
    //  console.log(allCountries[i].alpha2);
    if (allCountries[i].alpha2 == val) {
      //alert("found" + allCountries[i]);
      //   console.log(allCountries[i]);
      cameraAnimate(allCountries[i].latitude, allCountries[i].longitude, camera);
      break;
    }
  }

});

animate();


document.body.style = "cursor: grab"

addEventListener('mousedown', () => {

  document.body.style = "cursor: -webkit-grabbing; cursor: grabbing;cursor: -webkit-grabbing; cursor: grabbing;"


})

addEventListener('mouseup', () => {


  document.body.style = "cursor: grab"

  let closeButton = document.querySelector(".modal-content");

  closeButton.remove();


})


























