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
  "esri/widgets/Measurement",
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
  LayerList,
  Measurement
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
  const commRenderer = {
    type: "class-breaks",

    field: "Shape_Area",
    classBreakInfos: [
      {
        minValue: 0,
        maxValue: 8000000,
        symbol: {
          type: "simple-fill",
          color: "#FAF2EA",
          style: "solid",
          outline: {
            color: "white",
            width: 1,
          },
        },
      },
      {
        minValue: 8000001,
        maxValue: 16000000,
        symbol: {
          type: "simple-fill",
          color: "#FFD0E6",
          style: "solid",
          outline: {
            color: "white",
            width: 1,
          },
        },
      },
      {
        minValue: 16000001,
        maxValue: 26000000,
        symbol: {
          type: "simple-fill",
          color: "#FFAE9D",
          style: "solid",
          outline: {
            color: "white",
            width: 1,
          },
        },
      },
      {
        minValue: 26000001,

        maxValue: 78000000,
        symbol: {
          type: "simple-fill",
          color: "#B39188",
          style: "solid",
          outline: {
            color: "white",
            width: 1,
          },
        },
      },
      {
        minValue: 78000001,
        maxValue: 135000000,
        symbol: {
          type: "simple-fill",
          color: "#392E2C",
          style: "solid",
          outline: {
            color: "white",
            width: 1,
          },
        },
      },
    ],
  };
  let Commune = new FeatureLayer({
    url: "https://services5.arcgis.com/KeHihixLGtBfk702/arcgis/rest/services/communes_wgs/FeatureServer",
    outFiealds: ["PREFECTURE", "COMMUNE_AR", "Shape_Area"],
    popupTemplate: popupCommune,
    renderer: commRenderer,
  });
  map.add(Commune, 0);
});
