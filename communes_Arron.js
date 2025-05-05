require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/geometry/Extent",
  "esri/widgets/BasemapToggle",
  "esri/widgets/BasemapGallery",
  "esri/layers/FeatureLayer",
  "esri/PopupTemplate",
  "esri/widgets/Legend",
  "esri/renderers/Renderer",
  "esri/renderers/PieChartRenderer",
  "esri/widgets/Expand",
  "esri/widgets/Search",
  "esri/widgets/LayerList",
], function (
  esriConfig,
  Map,
  MapView,
  Extent,
  BasemapToggle,
  BasemapGallery,
  FeatureLayer,
  PopupTemplate,
  Legend,
  Renderer,
  PieChartRenderer,
  Expand,
  Search,
  LayerList
) {
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurHrQeGD5XEElaNsfXf8FyqVbkD2VbnkX2XtA8WgtAqjKgjXb1meDzQv9r8cB2QvTeVX5kqr22z4P1jUR8TkSHH7aFvEn5frK-1cRQng5cPHGqn4AePXkSQQFMw1sEQC3ME_gexE8bqev5BTG-BOeUb2kkEhoDuWxgfX46C_gzmRjMfXZgiFsCBQYnsB00DdcjOy4xSJ7_bBgYqyakp6hjd_5I6u8GVRvsmWoo4OmFNvqAT1_szgXgvkg";
  const map = new Map({
    basemap: "streets-navigation-vector", 
  });
  const newExtent = new Extent({
    xmin: -890786.1005393523,
    ymin: 3968335.5749455704,
    xmax: -781378.9498606478,
    ymax: 3996292.93725,
    spatialReference: 102100,
  });
  const view = new MapView({
    map: map,
    extent: newExtent,
    
    container: "viewDiv", 
  });
  var legend = new Legend({
    view: view,
  });

  var search = new Search({
    view: view,
  });
  view.ui.add(search, "top-right");
  var layerList = new LayerList({
    view: view,
  });

  view.ui.add(
    new Expand({
      view: view,
      content: legend,
      expandIconClass: "esri-icon-layer-list",
      expandTooltip: "Legend",
    }),
    "bottom-right"
  );

  view.ui.add(
    new Expand({
      view: view,
      content: layerList,
      expandIconClass: "esri-icon-layers",
      expandTooltip: "Layer List",
    }),
    "top-right"
  );
  let mybasemapG = new BasemapGallery({
    view: view,
    nextBasemap: "topo",
  });
  var basemapExpand = new Expand({
    view: view,
    content: mybasemapG,
    expandIconClass: "esri-icon-basemap", 
    expandTooltip: "Toggle Basemap Gallery",
  });
  view.ui.add(basemapExpand, {
    position: "top-right",
  });
  var popupCommune = new PopupTemplate({
    title: "<b>Préfecture: {PREFECTURE}</b>",
    content:
      "<p> PREFECTURE : {PREFECTURE} </p>" +
      "<p> Commune : {COMMUNE_AR} </p> " +
      "<p> Surface : {Shape_Area} </p> ",
  });
  const commrenderer = {
    type: "simple", 
    symbol: {
      type: "simple-fill", 
      style: "solid",
      outline: {
        color: "#2a9d8f",
        width: 2,
      },
    },
  };
  let Commune = new FeatureLayer({
    url: "https://services5.arcgis.com/KeHihixLGtBfk702/arcgis/rest/services/communes_wgs/FeatureServer",
    outFields: ["PREFECTURE", "COMMUNE_AR", "Shape_Area"],
    popupTemplate: popupCommune,
    renderer: commrenderer,
  });

  map.add(Commune, 0);
  var popupHotel = new PopupTemplate({
    title: "<b>L'hôtel: {HOTEL}</b>",
    content:
      "<p> Catégorie : {CATÉGORIE} </p>" +
      "<p> L'adresse : {ADRESSE} </p> " +
      "<p> Etoile : {Etoile} </p> ",
  });
  let hotelRenderer = {
    type: "simple",  
    symbol: {
      type: "simple-marker", 
      color: "#AB47A3",
      outline: {
        width: 0.5,
        color: "white",
      },
    },
  };

  let hotel = new FeatureLayer({
    url: "https://services5.arcgis.com/KeHihixLGtBfk702/arcgis/rest/services/Hotels_wgs/FeatureServer",
    outFields: ["CATÉGORIE", "ADRESSE", "Etoile"],
    popupTemplate: popupHotel,
    renderer: hotelRenderer,
  });
  map.add(hotel, 1);

  const sqlExpressions2 = [
    "-- Critère de recherche --",
    "Etoile=1",
    "Etoile=2",
    "Etoile=3",
    "Etoile=4",
    "Etoile=5",
  ];
  const selectFilter2 = document.createElement("select");
  sqlExpressions2.forEach(function (sql) {
    let option = document.createElement("option");
    option.value = sql;
    option.innerHTML = sql;
    selectFilter2.appendChild(option);
  });
  view.ui.add(selectFilter2, "top-right");
  function setFeatureLayerFilter(expression) {
    hotel.definitionExpression = expression;
  }
  selectFilter2.addEventListener("change", function (event) {
    setFeatureLayerFilter(event.target.value);
  });
});
