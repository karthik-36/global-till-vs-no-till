//import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'


import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'


document.getElementById("populationRadio").addEventListener("click", checkClickPop);
document.getElementById("tempratureRadio").addEventListener("click", checkClickTemp);
document.getElementById("cropRadio").addEventListener("click", checkClickCrop);

// document.getElementById('popSlider').style.display = 'none'
// document.getElementById('tempLegend').style.display = 'none'
// document.getElementById('tempSlider').style.display = 'none'
// document.getElementById('popLegend').style.display = 'none'

const centerHolder = document.getElementById('centerHolder');
centerHolder.remove();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var selectedArea = null;
var countryDisplay = null;
var populationDisplay = null;
var cityDisplay = null;
var tempratureDisplay = null;
var groupCrops;
let cropColors = [
  '#8b4513',
  '#006400',
  '#4682b4',
  '#4b0082',
  '#ff0000',
  '#ffd700',
  '#00ff7f',
  '#00ffff',
  '#0000ff',
  '#ff1493',
  '#ffe4c4',
]

window.addEventListener('click', onDocumentMouseDown, false);

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function onDocumentMouseDown(event) {

  //event.preventDefault();

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
  else if (mainMode == 'crop') {
    if (intersects.length > 0) {
      console.log(intersects);
      // let city = document.getElementById("countryDisplay");
      // let temprature = document.getElementById("populationDisplay");
      // for (let i = 0; i < intersects.length; i++) {
      //   if (intersects[i].object.City != '') {
      //     cityDisplay = intersects[i].object.city;
      //     tempratureDisplay = intersects[i].object.temprature;
      //     break;
      //   }
      // }

      // if (cityDisplay != null) {
      //   city.innerHTML = cityDisplay;
      //   temprature.innerHTML = tempratureDisplay + " °C";
      // }


    }


  }

}

var mainMode = 'population';
function checkClickPop(mode) {

  centerHolder.remove();

  document.getElementById('info').style.display = 'block'
  // document.getElementById('popSlider').style.display = 'none'
  // document.getElementById('tempSlider').style.display = ''

  // document.getElementById('popLegend').style.display = ''
  // document.getElementById('tempLegend').style.display = 'none'


  document.getElementById('countryCity').innerHTML = "Country";
  document.getElementById('populationTemp').innerHTML = "Population";

  document.getElementById('countryDisplay').innerHTML = "-----";
  document.getElementById('populationDisplay').innerHTML = "-----";


  //

  // document.getElementById('popLegend').style.display = 'none'
  // document.getElementById('tempLegend').style.display = 'none'

  //



  let radio = document.getElementById('tempratureRadio')
  radio.checked = false;
  radio.setAttribute("style", "background : #FFFFF;");
  radio = document.getElementById('cropRadio')
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
  // document.getElementById('popSlider').style.display = ''
  // document.getElementById('tempSlider').style.display = 'none'


  // document.getElementById('popLegend').style.display = 'none'
  // document.getElementById('tempLegend').style.display = ''



  document.getElementById('countryCity').innerHTML = "City";
  document.getElementById('populationTemp').innerHTML = "Temprature";



  document.getElementById('countryDisplay').innerHTML = "-----";
  document.getElementById('populationDisplay').innerHTML = "-----";


  //

  // document.getElementById('popLegend').style.display = 'none'
  // document.getElementById('tempLegend').style.display = 'none'

  //

  // <h5 id = "countryCity"> country </h5>
  // <h3 id = "countryDisplay"> ----- </h3>
  // <h5 id = "populationTemp"> population </h5>
  // <h3 id = "populationDisplay"> ----- </h3>


  let radio = document.getElementById('populationRadio')
  radio.setAttribute("style", "background : #FFFFF;");
  radio = document.getElementById('cropRadio')
  radio.setAttribute("style", "background : #FFFFF;");
  radio = document.getElementById('tempratureRadio')
  radio.setAttribute("style", "background : #4CAF50;   outline : 2px dashed rgb(96, 255, 117);");
  radio.checked = true;

  mainMode = 'temprature';


  createTemp(12);
  scene.remove(groupCities);


}



function checkClickCrop() {


  console.log("here crop");

  centerHolder.remove();

  countryDisplay = null;
  populationDisplay = null;
 // document.getElementById('info').style.display = 'block'
  // document.getElementById('popSlider').style.display = ''
  // document.getElementById('tempSlider').style.display = 'none'


  // document.getElementById('popLegend').style.display = 'none'
  // document.getElementById('tempLegend').style.display = ''



  document.getElementById('countryCity').innerHTML = "Crop Type";
  document.getElementById('populationTemp').innerHTML = "Yield";



  document.getElementById('countryDisplay').innerHTML = "-----";
  document.getElementById('populationDisplay').innerHTML = "-----";



  //

  // document.getElementById('popLegend').style.display = 'none'
  // document.getElementById('tempLegend').style.display = 'none'

  //

  // <h5 id = "countryCity"> country </h5>
  // <h3 id = "countryDisplay"> ----- </h3>
  // <h5 id = "populationTemp"> population </h5>
  // <h3 id = "populationDisplay"> ----- </h3>


  let radio = document.getElementById('populationRadio')
  radio.setAttribute("style", "background : #FFFFF;");
  radio = document.getElementById('tempratureRadio')
  radio.setAttribute("style", "background : #FFFFF;");
  radio = document.getElementById('cropRadio')
  radio.setAttribute("style", "background : #4CAF50;   outline : 2px dashed rgb(96, 255, 117);");
  radio.checked = true;

  mainMode = 'crops';


  createCrop(selectedCrops);
  scene.remove(groupCities);


}



let tempMap = new Map();

for (let i = allTemprature.length - 1; i != -1; i--) {
  let postFix = parseInt(allTemprature[i].dt.split("-")[1]);
  if (!tempMap.has(allTemprature[i].City + "_" + postFix)) {
    tempMap.set(allTemprature[i].City + "_" + postFix, allTemprature[i])
  }
}

let cropMap = new Map();

for (let i = 0; i < allCrops.length; i++) {
  if (cropMap.has(allCrops[i].Crop)) {
    cropMap.set(allCrops[i].Crop, cropMap.get(allCrops[i].Crop).concat(allCrops[i]));
  } else {
    cropMap.set(allCrops[i].Crop, [allCrops[i]]);
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

  // let city = document.getElementById("countryDisplay");
  // let temprature = document.getElementById("populationDisplay");
  // city.innerHTML = "-----";
  // temprature.innerHTML = "-----";


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

      if (cityDisplay == value.City) {
        city.innerHTML = value.City;
        temprature.innerHTML = realTemp + " °C";
      }

    }
  }
  scene.add(groupCities2)
}




var createCrop = function (cropFilter, yearLeft, yearRight) {

  scene.remove(groupCities);
  scene.remove(groupCities2);
  scene.remove(groupCrops);
  groupCrops = new THREE.Group();

  let colorNum = 0;
  for (let [key, value] of cropMap) {
    if (selectedCrops.has(key)) {
      for(let i = 0 ; i < value.length ; i++){
        
        let newMesh = new THREE.Mesh(
          new THREE.CircleGeometry( 0.08, 32 ),
          new THREE.MeshBasicMaterial({ color: cropColors[colorNum], side: THREE.DoubleSide, transparent: true, opacity: 0.78 })
        )

        let position = convertLatLngToCordinate3(value[i].Latitude, value[i].Longitude, 5.0 + (0.008 * colorNum))
        newMesh.position.set(position.x, position.y, position.z);
  
        groupCrops.add(newMesh);
        newMesh.lookAt(center.position);

      }
    }
    colorNum++;
  }

  scene.add(groupCrops);
}


scene.add(group)

function animate() {

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  //sphere.rotation.y += 0.001;
  //groupCities.rotation.y += 0.001;
  //group.rotation.y = mouse.x;
  //group.rotation.x = mouse.y;
}





// var slider = document.getElementById('myRange')
// var output = document.getElementById('demo')
// output.innerHTML = "<b> 2012-" + slider.value + "-01" + " </b>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    Max : 2017";

// slider.oninput = function () {
//   output.innerHTML = this.value + " </b>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    Max : 2012-12-01";
//   createTemp(this.value);

// }



// var slider2 = document.getElementById('myRange2')
// var output2 = document.getElementById('demo2')
// output2.innerHTML = "<b>" + slider2.value + " </b>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;      Max : 2021"

// slider2.oninput = function () {
//   output2.innerHTML = "<b>" + this.value + " </b>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     Max : 2021"
//   createPop(this.value);

// }

// function ValidateCropSelection(){
//   console.log("hello");
// }

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
    if (allCountries[i].alpha2 == val) {
      cameraAnimate(allCountries[i].latitude, allCountries[i].longitude, camera);
      break;
    }
  }
});


const selectAllCrop = document.getElementById('allCropChecks');

selectAllCrop.addEventListener('change', (event) => {

  createCrop();

});

animate();


document.body.style = "cursor: grab"

addEventListener('mousedown', () => {

  document.body.style = "cursor: -webkit-grabbing; cursor: grabbing;cursor: -webkit-grabbing; cursor: grabbing;"


})

addEventListener('mouseup', () => {


  document.body.style = "cursor: grab"

  let closeButton = document.querySelector(".modal-content");

  try {
    closeButton.remove();
  } catch (e) {

  }


})



/////////////

// set the dimensions and margins of the graph
var margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#myDataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = ["valueA", "valueB", "valueC"]

    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.map(function(d) {
          return {time: d.time, value: +d[grpName]};
        })
      };
    });
    // I strongly advise to have a look to dataReady with
    // console.log(dataReady)

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([0,10])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0,20])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the lines
    var line = d3.line()
      .x(function(d) { return x(+d.time) })
      .y(function(d) { return y(+d.value) })
    svg.selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return myColor(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none")

    // Add the points
    svg
      // First we need to enter in a group
      .selectAll("myDots")
      .data(dataReady)
      .enter()
        .append('g')
        .style("fill", function(d){ return myColor(d.name) })
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(function(d){ return d.values })
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.time) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 5)
        .attr("stroke", "white")

    // Add a legend at the end of each line
    svg
      .selectAll("myLabels")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
          .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
          .attr("x", 12) // shift the text a bit more right
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return myColor(d.name) })
          .style("font-size", 15)

})

/////////////


var inputLeft = document.getElementById("input-left");
var inputRight = document.getElementById("input-right");

var thumbLeft = document.querySelector(".slider > .thumb.left");
var thumbRight = document.querySelector(".slider > .thumb.right");
var range = document.querySelector(".slider > .range");

function setLeftValue() {
	var _this = inputLeft,
		min = parseInt(_this.min),
		max = parseInt(_this.max);

	_this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);

	var percent = ((_this.value - min) / (max - min)) * 100;

	thumbLeft.style.left = percent + "%";
	range.style.left = percent + "%";
}
setLeftValue();

function setRightValue() {
	var _this = inputRight,
		min = parseInt(_this.min),
		max = parseInt(_this.max);

	_this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);

	var percent = ((_this.value - min) / (max - min)) * 100;

	thumbRight.style.right = (100 - percent) + "%";
	range.style.right = (100 - percent) + "%";
}
setRightValue();

inputLeft.addEventListener("input", setLeftValue);
inputRight.addEventListener("input", setRightValue);

inputLeft.addEventListener("mouseover", function() {
	thumbLeft.classList.add("hover");
});
inputLeft.addEventListener("mouseout", function() {
	thumbLeft.classList.remove("hover");
});
inputLeft.addEventListener("mousedown", function() {
	thumbLeft.classList.add("active");
});
inputLeft.addEventListener("mouseup", function() {
	thumbLeft.classList.remove("active");
});

inputRight.addEventListener("mouseover", function() {
	thumbRight.classList.add("hover");
});
inputRight.addEventListener("mouseout", function() {
	thumbRight.classList.remove("hover");
});
inputRight.addEventListener("mousedown", function() {
	thumbRight.classList.add("active");
});
inputRight.addEventListener("mouseup", function() {
	thumbRight.classList.remove("active");
});





























