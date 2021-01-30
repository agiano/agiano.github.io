"use strict";
//#region Functions and Variables
const slider1 = document.getElementById("slider-1");
const sliderOutput1 = document.getElementById("slider-output-1");
const slider2 = document.getElementById("slider-2");
const sliderOutput2 = document.getElementById("slider-output-2");
const slider3 = document.getElementById("slider-3");
const sliderOutput3 = document.getElementById("slider-output-3");
const yearInput = document.getElementById("yearInput");
const check1 = document.getElementById("checkbox-1");
const check2 = document.getElementById("checkbox-2");
const check3 = document.getElementById("checkbox-3");
const check4 = document.getElementById("checkbox-4");
const check5 = document.getElementById("checkbox-5");

// const projection = "EPSG:4326";
// const mapExtent = [-180, -90, 180, 90];
// const mapCenter = [17.5, 41.9]

const projection = "EPSG:3857";
const mapExtent = [-21000000, -20000000, 21000000, 20000000];
const mapCenter = [2000000, 5000000];

const geoJSONformat = new ol.format.GeoJSON({
  dataProjection: "EPSG:4326",
  featureProjection: projection,
});
const topoJSONformat = new ol.format.TopoJSON({
  layers: ["coastMerged"],
});
const esriJSONformat = new ol.format.EsriJSON({});
const hoverStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: "rgb(0,0,0)",
    width: 1,
  }),
  fill: new ol.style.Fill({
    color: "rgba(122, 242, 255, 0)",
  }),
  text: new ol.style.Text({
    font: "italic 20px serif",
    fill: new ol.style.Fill({ color: "rgba(142, 39, 39)" }),
    // overflow: true,
    stroke: new ol.style.Stroke({ color: "#ffffff", width: 0.7 }),
  }),
});
const oceanStyle = function (feature, resolution) {
  return [
    new ol.style.Style({
      // stroke: new ol.style.Stroke({
      //   color: "rgba(82, 176, 186)",
      //   width: 1,
      // }),
      fill: new ol.style.Fill({
        color: "rgb(93, 198, 255)",
      }),
    }),
  ];
};
const riverStyle = function (feature, resolution) {
  return [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "rgb(113, 189, 255)",
        width: 1,
      }),
    }),
  ];
};
const coastStyle = function (feature, resolution) {
  return [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "rgb(0,0,0)",
        width: 1,
      }),
    }),
  ];
};
function getMapRes(res) {
  return map.getView().getResolutionForZoom(res);
}
const stateLabelCheckbox = document.getElementById("check-4-1");
const stateText = function (feature, resolution) {
  const maxRes = getMapRes(3.5);
  const minRes = getMapRes(6.5);
  let text = "";
  if (stateLabelCheckbox.checked === true) {
    if (resolution <= maxRes || resolution <= minRes) {
      text = feature.get("name");
    }
  }
  return text;
};
const stateScale = function (feature, resolution) {
  let scale = 1.5;
  if (projection === "EPSG:3857") {
    scale = 20000 / resolution;
  }
  return scale;
};
const stateStyle = function (feature, resolution) {
  return [
    new ol.style.Style({
      // stroke: new ol.style.Stroke({
      //   color: "rgba(82, 176, 186)",
      //   width: 1,
      // }),
      fill: new ol.style.Fill({
        color: "rgba(219, 255, 113, 1)",
      }),
      text: new ol.style.Text({
        font: "italic 10px serif",
        fill: new ol.style.Fill({ color: "rgba(142, 39, 39)" }),
        overflow: true,
        scale: stateScale(feature, resolution),
        text: stateText(feature, resolution),
        stroke: new ol.style.Stroke({ color: "#ffffff", width: 0.5 }),
      }),
    }),
  ];
};
const pleiadesText = function (feature, resolution) {
  const maxResolution = getMapRes(8);
  const minResolution = getMapRes(10);
  let text = feature.get("title");
  if (resolution >= maxResolution || resolution <= minResolution) {
    text = "";
  }
  return text;
};
const pleiadesStyle = function (feature, resolution) {
  return [
    new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: "rgba(92,0,0, 0.7)",
        }),
        // stroke: new ol.style.Stroke({
        //   color: "rgba(92,0,0,0.7)",
        //   width: 0.8,
        // }),
        radius: 2,
      }),
      text: new ol.style.Text({
        font: "italic 10px serif",
        fill: new ol.style.Fill({ color: "rgba(0,0,0)" }),
        textAlign: "left",
        offsetX: 5,
        offsetY: 5,
        overflow: true,
        text: pleiadesText(feature, resolution),
        // stroke: new ol.style.Stroke({ color: "#ffffff", width: 0.5 }),
      }),
    }),
  ];
};

const title1 = document.querySelector(".title-1");
const content1 = document.querySelector(".content-1");
const title2 = document.querySelector(".title-2");
const content2 = document.querySelector(".content-2");
const title3 = document.querySelector(".title-3");
const content3 = document.querySelector(".content-3");
const title4 = document.querySelector(".title-4");
const content4 = document.querySelector(".content-4");
// const showType = "grid";
const showType = "block";
function removeItemOnce(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
function checkArrayItem(arr, value) {
  if (arr.indexOf(value) < 0) {
    arr.push(value);
  }
}
//#endregion

//#region Initial Map

// window.onload = init;
// function init() {
// } //end of window.load //
const map = new ol.Map({
  view: new ol.View({
    // projection: "EPSG:4326",
    projection: projection,
    center: mapCenter,
    zoom: 5,
    maxZoom: 10.25,
    minZoom: 1,
    extent: mapExtent,
  }),
  layers: [],
  target: "map",
  controls: ol.control.defaults({ attribution: false, zoom: false }),
});
//#endregion

//#region //------ Base Layers ------//

// Basemaps Layers //

const googleSatellite = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    attributions: "Map data ©2020 Google",
    crossOrigin: "anonymous",
  }),
  visible: false,
  title: "googleSatellite",
});
const esriWorldImagery = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url:
      "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attributions:
      'Tiles © <a href="https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer">ArcGIS</a>',
    crossOrigin: "anonymous",
  }),
  visible: false,
  title: "esriWorldImagery",
});
const esriWorldTerrainBase = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url:
      "https://server.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
    attributions:
      'Tiles © <a href="https://server.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer">ArcGIS</a>',
    crossOrigin: "anonymous",
  }),
  visible: false,
  title: "esriWorldTerrainBase",
  maxZoom: 9,
});
const esriWorldHillshadeLight = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url:
      "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
    attributions:
      'Tiles © <a href="https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer">ArcGIS</a>',
    crossOrigin: "anonymous",
  }),
  visible: false,
  title: "esriWorldHillshadeLight",
  maxZoom: 13,
});
const esriWorldHillshadeDark = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url:
      "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer/tile/{z}/{y}/{x}",
    attributions:
      'Tiles © <a href="https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer">ArcGIS</a>',
    crossOrigin: "anonymous",
  }),
  visible: false,
  title: "esriWorldHillshadeDark",
});
const esriWorldOceanBase = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url:
      "https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
    attributions:
      'Tiles © <a href="https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer">ArcGIS</a>',
    crossOrigin: "anonymous",
  }),
  visible: true,
  title: "esriWorldOceanBase",
});

const baseLayerGroup = new ol.layer.Group({
  layers: [
    esriWorldHillshadeLight,
    esriWorldHillshadeDark,
    esriWorldOceanBase,
    googleSatellite,
    esriWorldImagery,
    esriWorldTerrainBase,
  ],
  zIndex: 100,
  opacity: 1,
  extent: mapExtent,
  id: 10,
});
map.addLayer(baseLayerGroup);

// Layer Switcher for Basemaps

const layerSelect = document.getElementById("layer-select");
const baseLayerElements = document.querySelectorAll(".layer-option");
layerSelect.addEventListener("change", function () {
  const selectValue = layerSelect.value;
  baseLayerGroup.getLayers().forEach(function (element, index, array) {
    let baseLayerTitle = element.get("title");
    element.setVisible(baseLayerTitle === selectValue);
  });
});

//#endregion

//#region //------ Vector Layers ------//

// const renderMode = "vector"
const renderMode = "image";

$.ajax({
  method: "GET",
  url:
    // "https://gist.githubusercontent.com/agiano/0948d99dbbafe16e7dea60911b8f4c2e/raw/78b14f82082204395262541e6990a679a8f92668/waterjson.geojson",
    "https://gist.githubusercontent.com/agiano/2a0e9fc232dbb21ef50baa15f413c40b/raw/f7c4b3e5cbea4d34bb774f3168e4f819b71edbb8/waterjson.geojson",
  dataType: "json",
  crossOrigin: "Anonymous",
}).done(function (data) {
  const dataSource = new ol.source.Vector({
    features: geoJSONformat.readFeatures(data),
  });
  const dataLayer = new ol.layer.Vector({
    source: dataSource,
    style: oceanStyle,
    renderMode: renderMode,
    extent: mapExtent,
    visible: false,
    id: 2,
  });
  map.addLayer(dataLayer);
  check2.addEventListener("change", function (e) {
    if (check2.checked == true) {
      dataLayer.setVisible(true);
    } else {
      dataLayer.setVisible(false);
    }
  });
});
$.ajax({
  method: "GET",
  url:
    "https://gist.githubusercontent.com/agiano/b65bb8bee66dfbd4e4e3381d565dcfa6/raw/14f0af16eceede3b72eae8cf6e75f1792029a810/bigrivers(10).geojson",
  dataType: "json",
  crossOrigin: "Anonymous",
}).done(function (data) {
  const dataSource = new ol.source.Vector({
    features: geoJSONformat.readFeatures(data),
  });
  const dataLayer = new ol.layer.Vector({
    source: dataSource,
    style: riverStyle,
    renderMode: renderMode,
    extent: mapExtent,
    visible: false,
    id: 3,
  });
  map.addLayer(dataLayer);
  check3.addEventListener("change", function (e) {
    if (check3.checked == true) {
      dataLayer.setVisible(true);
    } else {
      dataLayer.setVisible(false);
    }
  });
});
$.ajax({
  method: "GET",
  url:
    "https://gist.githubusercontent.com/agiano/4b0c212f4038ab5d205b8455ffecf243/raw/68ee974227cff676de7d8de43b8001780006d35c/topo-coast(10).json",
  dataType: "json",
  crossOrigin: "Anonymous",
}).done(function (data) {
  const dataSource = new ol.source.Vector({
    features: topoJSONformat.readFeatures(data, {
      dataProjection: "EPSG:4326",
      featureProjection: projection,
    }),
  });
  const dataLayer = new ol.layer.Vector({
    source: dataSource,
    style: coastStyle,
    renderMode: renderMode,
    extent: mapExtent,
    visible: false,
    id: 4,
  });
  map.addLayer(dataLayer);
  check1.addEventListener("change", function (e) {
    if (check1.checked == true) {
      dataLayer.setVisible(true);
    } else {
      dataLayer.setVisible(false);
    }
  });
});
$.ajax({
  method: "GET",
  url:
    "https://gist.githubusercontent.com/agiano/fcf95837669f13d9d283e97dc8d88100/raw/11f433559c06c98be74ceee31b06ec89efbb811a/states_data.geojson",
  dataType: "json",
  crossOrigin: "Anonymous",
}).done(function (data) {
  const allData = JSON.parse(JSON.stringify(data));
  const newData = JSON.parse(JSON.stringify(data));

  newData.features = [];

  const dataSource = new ol.source.Vector({
    features: geoJSONformat.readFeatures(newData),
  });
  // console.log(dataSource);
  const dataLayer = new ol.layer.Vector({
    source: dataSource,
    style: stateStyle,
    renderMode: renderMode,
    extent: mapExtent,
    visible: true,
    id: 1,
  });
  map.addLayer(dataLayer);
  check5.addEventListener("change", function (e) {
    if (check5.checked == true) {
      dataLayer.setVisible(true);
    } else {
      dataLayer.setVisible(false);
    }
  });
  // console.log(new Date(new Date().setFullYear(30, 0, 1))) -> yy/mm/dd
  sliderTime.on("onchange", (val) => {
    d3.select("p#value-time").text(d3.timeFormat(dateFormat)(val));
    const currentDate = d3.timeFormat(simpleDateFormat)(val);
    const dArr3 = currentDate.split("/");
    const d_3 = new Date(
      new Date().setFullYear(dArr3[2], parseInt(dArr3[1] - 1), dArr3[0])
    );
    for (let i = 0; i < allData.features.length; i++) {
      const start = allData.features[i].properties.start_date;
      const end = allData.features[i].properties.end_date;
      const dArr1 = start.split("/");
      const dArr2 = end.split("/");
      const d_1 = new Date(
        new Date().setFullYear(dArr1[2], parseInt(dArr1[1] - 1), dArr1[0])
      );
      const d_2 = new Date(
        new Date().setFullYear(dArr2[2], parseInt(dArr2[1] - 1), dArr2[0])
      );
      dataLayer.getSource().clear();
      if (d_1 <= d_3 && d_3 <= d_2) {
        // console.log("inside interval");
        checkArrayItem(newData.features, allData.features[i]);
        dataLayer.getSource().addFeatures(geoJSONformat.readFeatures(newData));
      } else {
        // console.log("outside interval");
        newData.features = removeItemOnce(
          newData.features,
          allData.features[i]
        );
        dataLayer.getSource().addFeatures(geoJSONformat.readFeatures(newData));
      }
    }
  });
});

$.ajax({
  method: "GET",
  url:
    "https://gist.githubusercontent.com/agiano/af02d7f99ef1c5be0f4f4d461109143b/raw/eebf0c6fbea7c11e929a90db50b19cf4476f3599/pleiades%2520settlements",
  dataType: "json",
  crossOrigin: "Anonymous",
}).done(function (data) {
  const dataSource = new ol.source.Vector({
    features: geoJSONformat.readFeatures(data),
  });

  const dataLayer = new ol.layer.Vector({
    source: dataSource,
    style: pleiadesStyle,
    renderMode: renderMode,
    extent: mapExtent,
    visible: false,
    declutter: false,
    id: 7,
  });
  map.addLayer(dataLayer);
  check4.addEventListener("change", function (e) {
    if (check4.checked == true) {
      dataLayer.setVisible(true);
    } else {
      dataLayer.setVisible(false);
    }
  });
});

//#endregion

//#region //------ Map Interactions ------//

// Drag and drop //

const dragSource = new ol.source.Vector();
const dragLayer = new ol.layer.Vector({
  source: dragSource,
  id: 5,
  extent: mapExtent,
});
map.addLayer(dragLayer);
const dragnDrop = new ol.interaction.DragAndDrop({
  formatConstructors: [
    ol.format.GeoJSON,
    ol.format.TopoJSON,
    ol.format.EsriJSON,
  ],
  source: dragSource,
});
dragnDrop.on("addfeatures", function (evt) {
  // console.log("new feature added");
});

// Drag Box //

// const dragBox = new ol.interaction.DragBox({})
// map.getView().fit(dragBox.getGeometry().getExtent() , map.getsize())
// map.addInteraction(dragBox)

// Draw Interaction //
const drawSource = new ol.source.Vector();
const drawLayer = new ol.layer.Vector({
  source: drawSource,
  id: 6,
});
map.addLayer(drawLayer);

const draw1 = new ol.interaction.Modify({
  source: drawSource,
});
const draw2 = new ol.interaction.Draw({
  source: drawSource,
  type: "Point",
});
const draw3 = new ol.interaction.Draw({
  source: drawSource,
  type: "LineString",
});
const draw4 = new ol.interaction.Draw({
  source: drawSource,
  type: "Circle",
});
const draw5 = new ol.interaction.Draw({
  source: drawSource,
  type: "Polygon",
});
// const draw6 = new ol.interaction.Draw({
//   source: drawSource,
//   type: "MultiPoint",
// });
// const draw7 = new ol.interaction.Draw({
//   source: drawSource,
//   type: "MultiLineString",
// });
// const draw8 = new ol.interaction.Draw({
//   source: drawSource,
//   type: "MultiPolygon",
// });
// const draw9 = new ol.interaction.Draw({
//   source: drawSource,
//   type: "GeometryCollection",
// });

// File Download //
function downloadasTextFile(filename, text) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/json;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const download = document.getElementById("saveDraw");
drawSource.on("change", function () {
  const features = drawSource.getFeatures();
  const json = geoJSONformat.writeFeatures(features);
  $("#json-val").val(json);
  // console.log(json);
});

// saveDraw downloads all drawings //
$("#saveDraw").on("click", function () {
  const text = $("#json-val").val();
  const filename = "features.geojson";
  // console.log(text)
  downloadasTextFile(filename, text);
});
// clearDraw clears all drawings //
const clearDraw = function () {
  drawSource.clear();
};
// clearGeo clears geoJSON shapes //
const clearGeo = function () {
  dragSource.clear();
};

const clearDrawBtn = document.getElementById("clearDraw");
const clearGeoJSONBtn = document.getElementById("geoClear");
clearDrawBtn.onclick = clearDraw;
clearGeoJSONBtn.onclick = clearGeo;

// Adding Disable Classes
const drawInput = document.querySelectorAll(
  ".sidebar-3 > .content-3 > .layer-list > input[type=radio]"
);
const drawInputArray = Array.from(drawInput);
for (let i = 0; i < drawInput.length; i++) {
  drawInput[i].classList.add("Disable-1");
}
document.getElementsByClassName("button-6")[0].classList.add("Disable-1");
const filtered = drawInputArray.filter(function (value, index, arr) {
  return index != 0;
});
for (let i = 0; i < filtered.length; i++) {
  filtered[i].classList.add("Disable-2");
}

// toggle dragndrop //

$(document).on("click", ".button-1", function (e) {
  $(".button-1").toggleClass("clicked");
  e.preventDefault();
  if ($(".button-1").hasClass("clicked")) {
    $(".Disable-1").attr("disabled", true);
    map.addInteraction(dragnDrop);
    // console.log("clicked" + " " + map.getInteractions().array_.length)
  } else if (!$(".button-1").hasClass("clicked")) {
    $(".Disable-1").attr("disabled", false);
    $(".button-6").attr("disabled", true);
    map.removeInteraction(dragnDrop);
    // console.log("not clicked" + " " + map.getInteractions().array_.length)
  }
});

// toggle draw tracing //

const snapSource = new ol.source.Vector();
const drawTrace = new ol.interaction.Snap({
  source: dragSource,
  edge: true,
  vertex: true,
  pixelTolerance: 15,
});
$(document).on("click", ".button-6", function (e) {
  $(".button-6").toggleClass("clicked");
  e.preventDefault();
  if ($(".button-6").hasClass("clicked")) {
    $(".draw-input-0").attr("disabled", true);
    map.addInteraction(drawTrace);
  } else if (!$(".button-6").hasClass("clicked")) {
    $(".draw-input-0").attr("disabled", false);
    map.removeInteraction(drawTrace);
  }
});

$(".button-6").attr("disabled", true);

// toggle draw type

for (let i = 0; i < drawInput.length; i++) {
  drawInput[i].addEventListener("change", function () {
    if (drawInput[i].value == 0) {
      map.removeInteraction(
        map.getInteractions().array_[map.getInteractions().array_.length - 1]
      );
      $(".Disable-2").attr("disabled", false);
      $(".button-1").attr("disabled", false);
      $(".button-6").attr("disabled", true);
    } else if (drawInput[i].value == 1) {
      map.addInteraction(draw1);
      $(".Disable-2").attr("disabled", true);
      $(".button-1").attr("disabled", true);
      $(".button-6").attr("disabled", false);
    } else if (drawInput[i].value == 2) {
      map.addInteraction(draw2);
      $(".Disable-2").attr("disabled", true);
      $(".button-1").attr("disabled", true);
      $(".button-6").attr("disabled", false);
    } else if (drawInput[i].value == 3) {
      map.addInteraction(draw3);
      $(".Disable-2").attr("disabled", true);
      $(".button-1").attr("disabled", true);
      $(".button-6").attr("disabled", false);
    } else if (drawInput[i].value == 4) {
      map.addInteraction(draw4);
      $(".Disable-2").attr("disabled", true);
      $(".button-1").attr("disabled", true);
      $(".button-6").attr("disabled", false);
    } else if (drawInput[i].value == 5) {
      map.addInteraction(draw5);
      $(".Disable-2").attr("disabled", true);
      $(".button-1").attr("disabled", true);
      $(".button-6").attr("disabled", false);
    }
    //  else if (drawInput[i].value == 6) {
    //   map.addInteraction(draw6);
    //   $(".Disable-2").attr("disabled", true);
    // } else if (drawInput[i].value == 7) {
    //   map.addInteraction(draw7);
    //   $(".Disable-2").attr("disabled", true);
    // } else if (drawInput[i].value == 8) {
    //   map.addInteraction(draw8);
    //   $(".Disable-2").attr("disabled", true);
    // } else if (drawInput[i].value == 9) {
    //   map.addInteraction(draw9);
    //   $(".Disable-2").attr("disabled", true);
    // }
  });
}

// console.log(map.getInteractions().a.length) // for OL4
// console.log(map.getInteractions().array_.length) // for OL6

//#endregion

//#region //------ History Maps ------//

// D3 year select

// Time
const yearIncrements = [
  -500,
  -400,
  -300,
  -200,
  -100,
  0,
  100,
  200,
  // 300,
  // 400,
  // 1250,
  // 1500,
  // 1750,
  // 2000,
];

const dateFormat = "%d ~ %m ~ %Y";
const simpleDateFormat = "%d/%m/%Y";
const dataTime = yearIncrements.map(function (d) {
  return new Date().setFullYear(d, 0, 1);
});
const sliderTime = d3
  .sliderBottom()
  .min(d3.min(dataTime))
  .max(d3.max(dataTime))
  // .step(1000 * 60 * 60 * 24 * 365)
  .width(350)
  .tickFormat(d3.timeFormat("%Y"))
  .tickValues(dataTime)
  .default(new Date().setFullYear(0, 0, 1));
// .on("onchange", (val) => {
//   d3.select("p#value-time").text(d3.timeFormat(dateFormat)(val));
// });
const gTime = d3
  .select("div#slider-time")
  .append("svg")
  .attr("width", 400)
  .attr("height", 100)
  .append("g")
  .attr("transform", "translate(30,30)");
gTime.call(sliderTime);
d3.select("p#value-time").text(d3.timeFormat(dateFormat)(sliderTime.value()));
// console.log(yearIncrements.map(function (d) {
//   return new Date(d, 0, 1);
// }))
//#endregion

//#region //------ Layout js ------//

// Toggle Show/Hide Tabs //

title1.onclick = function displayToggle1() {
  const style = getComputedStyle(content1).display;
  if (style === showType) {
    content1.style.display = "none";
  } else {
    content1.style.display = showType;
  }
};
title2.onclick = function displayToggle2() {
  const style = getComputedStyle(content2).display;
  if (style === showType) {
    content2.style.display = "none";
  } else {
    content2.style.display = showType;
  }
};
title3.onclick = function displayToggle3() {
  const style = getComputedStyle(content3).display;
  if (style === "block") {
    content3.style.display = "none";
  } else {
    content3.style.display = "block";
  }
};
title4.onclick = function displayToggle3() {
  const style = getComputedStyle(content4).display;
  if (style === "block") {
    content4.style.display = "none";
  } else {
    content4.style.display = "block";
  }
};
$(".menu-container-1").click(function () {
  $(".grid-1").toggleClass("hidden");
  $(".grid-1").toggleClass("block");
  $(".menu-container-2").toggleClass("hidden");
  $(".menu-container-2").toggleClass("block");
});
$(".menu-container-2").click(function () {
  $(".grid-1").toggleClass("hidden");
  $(".grid-1").toggleClass("block");
  $(".menu-container-2").toggleClass("hidden");
  $(".menu-container-2").toggleClass("block");
});
$("#showDraw").click(function () {
  $("#json-val").toggleClass("hidden");
  if ($("#json-val").hasClass("hidden") === true) {
    $("#showDraw").html("Show Drawing Text");
  }
  $("#json-val").toggleClass("block");
  if ($("#json-val").hasClass("block") === true) {
    $("#showDraw").html("Hide Drawing Text");
  }
});
//#endregion

//#region //------ Map Customization ------//

// States on Hover
let selected = null;
map.on("pointermove", function (e) {
  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }
  map.forEachFeatureAtPixel(e.pixel, function (F, L) {
    if (L !== null && L.values_.id === 1) {
      selected = F;
      const text = F.get("name");
      hoverStyle.getText().setText(text);
      F.setStyle(hoverStyle);
      return true;
    }
  });
});

$("#slider-1").slider({
  min: 0,
  max: 100,
  value: 100,
  slide: function (event, e) {
    baseLayerGroup.setOpacity(e.value / 100);
    sliderOutput1.innerHTML = e.value / 100;
  },
});
$("#slider-2").slider({
  min: 0,
  max: 100,
  value: 100,
  slide: function (event, e) {
    for (let i = 0; i < map.getLayers().array_.length; i++) {
      if (
        map.getLayers().array_[i].values_.id >= 2 &&
        map.getLayers().array_[i].values_.id <= 4
      ) {
        map.getLayers().array_[i].setOpacity(e.value / 100);
      }
    }
    sliderOutput2.innerHTML = e.value / 100;
  },
});
$("#slider-3").slider({
  min: 0,
  max: 100,
  value: 100,
  slide: function (event, e) {
    for (let i = 0; i < map.getLayers().array_.length; i++) {
      if (map.getLayers().array_[i].values_.id == 1) {
        map.getLayers().array_[i].setOpacity(e.value / 100);
      }
    }
    sliderOutput3.innerHTML = e.value / 100;
  },
});
// map.on("click", function (e) {
//   for (let i = 0; i < map.getLayers().array_.length; i++) {
//     console.log(map.getLayers().array_[i].values_.id);
//   }
// });

// Popups on feature click //

const popElement = document.getElementById("popup");
const popup = new ol.Overlay({
  element: popElement,
  autopan: true,
  position: undefined,
  positioning: "bottom-center",
  offset: [0, -10],
});
map.addOverlay(popup);
const overLayFeatureName = document.getElementById("feature-name");
const overLayFeatureStartDate = document.getElementById("feature-start-date");
const overLayFeatureEndDate = document.getElementById("feature-end-date");
map.on("click", function (e) {
  popup.setPosition(undefined);
  map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
    // if (layer.id)
    if (layer !== null && layer.values_.id === 1) {
      let clickedCoordinate = e.coordinate;
      let clickedFeatureName = feature.values_.name;
      let clickedFeatureStartDate = feature.values_.start_date;
      let clickedFeatureEndDate = feature.values_.end_date;
      popup.setPosition(clickedCoordinate);
      overLayFeatureName.innerHTML = clickedFeatureName;
      overLayFeatureStartDate.innerHTML = clickedFeatureStartDate;
      overLayFeatureEndDate.innerHTML = clickedFeatureEndDate;
    }
  });
});

const popElement2 = document.getElementById("popup-2");
const popup2 = new ol.Overlay({
  element: popElement,
  autopan: true,
  position: undefined,
  positioning: "bottom-center",
  offset: [0, -10],
});
map.addOverlay(popup);

map.on("click", function (e) {
  popup.setPosition(undefined);
  map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
    // if (layer.id)
    if (layer !== null && layer.values_.id === 7) {
      let clickedCoordinate = e.coordinate;
      popup.setPosition(clickedCoordinate);

      console.log(feature.values_);

      let clickedFeatureName = feature.values_.name;
      let clickedFeatureStartDate = feature.values_.start_date;
      let clickedFeatureEndDate = feature.values_.end_date;

      overLayFeatureName.innerHTML = clickedFeatureName;
      overLayFeatureStartDate.innerHTML = clickedFeatureStartDate;
      overLayFeatureEndDate.innerHTML = clickedFeatureEndDate;
    }
  });
});
// end of popups

// Image Filter
var kernels = {
  none: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  sharpenless: [0, -1, 0, -1, 10, -1, 0, -1, 0],
  blur: [1, 1, 1, 1, 1, 1, 1, 1, 1],
  shadow: [1, 2, 1, 0, 1, 0, -1, -2, -1],
  emboss: [-2, 1, 0, -1, 1, 1, 0, 1, 2],
  edge: [0, 1, 0, 1, -4, 1, 0, 1, 0],
};
function normalize(kernel) {
  var len = kernel.length;
  var normal = new Array(len);
  var i,
    sum = 0;
  for (i = 0; i < len; ++i) {
    sum += kernel[i];
  }
  if (sum <= 0) {
    normal.normalized = false;
    sum = 1;
  } else {
    normal.normalized = true;
  }
  for (i = 0; i < len; ++i) {
    normal[i] = kernel[i] / sum;
  }
  return normal;
}
var select = document.getElementById("kernel");
var selectedKernel = normalize(kernels[select.value]);
//  * Update the kernel and re-render on change.
select.onchange = function () {
  selectedKernel = normalize(kernels[select.value]);
  map.render();
};

//  * Apply a filter on "postrender" events.
for (let i = 0; i < baseLayerGroup.values_.layers.array_.length; i++) {
  baseLayerGroup.values_.layers.array_[i].on("postrender", function (event) {
    if (document.getElementById("imageFilter").checked === true) {
      convolve(event.context, selectedKernel);
    }
  });
}

//  * Apply a convolution kernel to canvas.  This works for any size kernel, but performance starts degrading above 3 x 3.
//  * @param {CanvasRenderingContext2D} context Canvas 2d context.
//  * @param {Array<number>} kernel Kernel.
function convolve(context, kernel) {
  var canvas = context.canvas;
  var width = canvas.width;
  var height = canvas.height;
  var size = Math.sqrt(kernel.length);
  var half = Math.floor(size / 2);
  var inputData = context.getImageData(0, 0, width, height).data;
  var output = context.createImageData(width, height);
  var outputData = output.data;
  for (var pixelY = 0; pixelY < height; ++pixelY) {
    var pixelsAbove = pixelY * width;
    for (var pixelX = 0; pixelX < width; ++pixelX) {
      var r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (var kernelY = 0; kernelY < size; ++kernelY) {
        for (var kernelX = 0; kernelX < size; ++kernelX) {
          var weight = kernel[kernelY * size + kernelX];
          var neighborY = Math.min(
            height - 1,
            Math.max(0, pixelY + kernelY - half)
          );
          var neighborX = Math.min(
            width - 1,
            Math.max(0, pixelX + kernelX - half)
          );
          var inputIndex = (neighborY * width + neighborX) * 4;
          r += inputData[inputIndex] * weight;
          g += inputData[inputIndex + 1] * weight;
          b += inputData[inputIndex + 2] * weight;
          a += inputData[inputIndex + 3] * weight;
        }
      }
      var outputIndex = (pixelsAbove + pixelX) * 4;
      outputData[outputIndex] = r;
      outputData[outputIndex + 1] = g;
      outputData[outputIndex + 2] = b;
      outputData[outputIndex + 3] = kernel.normalized ? a : 255;
    }
  }
  context.putImageData(output, 0, 0);
} // end of image filter

//#endregion
