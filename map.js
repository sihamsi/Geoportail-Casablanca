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
  "esri/smartMapping/renderers/univariateColorSize",
  "esri/smartMapping/symbology/color",
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
  univariateColorSizeRendererCreator,
  colorSchemes
) {
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurHrQeGD5XEElaNsfXf8FyqVbkD2VbnkX2XtA8WgtAqjKgjXb1meDzQv9r8cB2QvTeVX5kqr22z4P1jUR8TkSHH7aFvEn5frK-1cRQng5cPHGqn4AePXkSQQFMw1sEQC3ME_gexE8bqev5BTG-BOeUb2kkEhoDuWxgfX46C_gzmRjMfXZgiFsCBQYnsB00DdcjOy4xSJ7_bBgYqyakp6hjd_5I6u8GVRvsmWoo4OmFNvqAT1_szgXgvkg";
  const map = new Map({
    basemap: "streets",
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
    "bottom-left"
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
  var popupVoirie = new PopupTemplate({
    title: "Voirie de Casablanca",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "NOM",
            label: "",
            isEditable: true,
            tooltip: "",
            visible: true,
            format: null,
            stringFieldOption: "text-box",
          },
          {
            fieldName: "LENGTH",
            label: "Longueur",
            isEditable: true,
            tooltip: "",
            visible: true,
            format: {
              places: 1,
              digitSeparator: true,
            },
            stringFieldOption: "text-box",
          },
        ],
      },
    ],
  });
  let voirieRenderer = {
    type: "simple",
    symbol: {
      type: "simple-line",
      color: "#00353F",
      width: "2px",
      style: "solid",
    },
  };
  let Voirie = new FeatureLayer({
    url: "https://services5.arcgis.com/KeHihixLGtBfk702/arcgis/rest/services/Voirie_casa/FeatureServer",
    popupTemplate: popupVoirie,
    renderer: voirieRenderer,
  });
  map.add(Voirie, 1);
  var popupCommune = new PopupTemplate({
    title: "<b>Commune: {COMMUNE_AR}</b>",
    content:
      "<p> PREFECTURE : {PREFECTURE} </p>" +
      "<p> Communes : {COMMUNE_AR} </p> " +
      "<p> Surface : {Shape_Area} </p> ",
  });
  let communeRenderer = {
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
    outFiealds: ["PREFECTURE", "COMMUNE_AR", "Shape_Area"],
    popupTemplate: popupCommune,
    renderer: communeRenderer,
  });
  map.add(Commune, 0);
  var popupPopulation = new PopupTemplate({
    title: "<b>Population de : {ARRONDISSE}</b>",
    content: [
      {
        type: "text",
        text: "Voici les statistiques de population pour {ARRONDISSE}.",
      },

      {
        type: "media",
        mediaInfos: [
          {
            type: "pie-chart",
            caption: "Statistiques de Casablanca",
            value: {
              fields: ["TOTAL1994", "TOTAL2004"],
              normalizeField: null,
              tooltipField: "",
            },
          },
        ],
      },
    ],
  });
  let popRenderer = {
    type: "simple",
    symbol: {
      type: "simple-marker",
      size: 10,
      color: "#A7001E",
      outline: {
        width: 0.5,
        color: "white",
      },
    },
  };
  const sizeVisualVariable = {
    type: "size",
    field: "TOTAL2004",
    minDataValue: 3365,
    maxDataValue: 323944,
    minSize: 8,
    maxSize: 30,
  };
  popRenderer.visualVariables = [sizeVisualVariable];

  let Population = new FeatureLayer({
    url: "https://services5.arcgis.com/KeHihixLGtBfk702/arcgis/rest/services/Casa_population/FeatureServer",
    popupTemplate: popupPopulation,
  });
  map.add(Population, 2);
  const params = {
    layer: Population,
    view: view,
    theme: "above-and-below",
    valueExpression: "$feature.TOTAL2004 - $feature.TOTAL1994",
    valueExpressionTitle: "Change in Population 1994-2004",
    symbolOptions: {
      symbolStyle: "arrow",
      colorScheme: {
        above: ["#FE277E"],
        below: ["#FCFE19"],
      },
    },
  };

  univariateColorSizeRendererCreator
    .createContinuousRenderer(params)
    .then(function (response) {
      Population.renderer = response.renderer;
    })
    .catch(function (error) {
      console.error("Error creating renderer: ", error);
    });
});
