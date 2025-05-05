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
  "esri/layers/GraphicsLayer",
  "esri/geometry/Point",
  "esri/Graphic",
  "esri/widgets/Editor",
  "esri/widgets/Sketch/SketchViewModel",
  "esri/rest/geoprocessor",
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
  GraphicsLayer,
  Point,
  Graphic,
  Editor,
  SketchViewModel,
  Geoprocessor
) {
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurHrQeGD5XEElaNsfXf8FyqVbkD2VbnkX2XtA8WgtAqjKgjXb1meDzQv9r8cB2QvTeVX5kqr22z4P1jUR8TkSHH7aFvEn5frK-1cRQng5cPHGqn4AePXkSQQFMw1sEQC3ME_gexE8bqev5BTG-BOeUb2kkEhoDuWxgfX46C_gzmRjMfXZgiFsCBQYnsB00DdcjOy4xSJ7_bBgYqyakp6hjd_5I6u8GVRvsmWoo4OmFNvqAT1_szgXgvkg";

  const map = new Map({
    basemap: "streets-navigation-vector", // Basemap layer service
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
    container: "viewDivv", // Div element
  });

  var legend = new Legend({ view: view });
  var search = new Search({ view: view });
  view.ui.add(search, "top-right");

  var layerList = new LayerList({ view: view });
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

  let mybasemapG = new BasemapGallery({ view: view, nextBasemap: "topo" });
  var basemapExpand = new Expand({
    view: view,
    content: mybasemapG,
    expandIconClass: "esri-icon-basemap",
    expandTooltip: "Toggle Basemap Gallery",
  });
  view.ui.add(basemapExpand, { position: "top-right" });

  var popupCommune = new PopupTemplate({
    title: "<b>Préfecture: {PREFECTURE}</b>",
    content:
      "<p> PREFECTURE : {PREFECTURE} </p>" +
      "<p> Commune : {COMMUNE_AR} </p> " +
      "<p> Surface : {Shape_Area} </p> ",
  });

  var popupSite = new PopupTemplate({
    title: "<b>Préfecture: {PREFECTURE}</b>",
    content:
      "<p> PREFECTURE : {PREFECTURE} </p>" +
      "<p> Site : {Site}</p>" +
      "<p> Commune : {Commune_Ce} </p> " +
      "<p> Surface : {ETAT} </p> ",
  });

  var popupSdau = new PopupTemplate({
    title: "<b>Préfecture: {PREFECTURE}</b>",
    content:
      "<p> PREFECTURE : {PREFECTURE} </p>" +
      "<p> Sdau : {SDAU} </p> " +
      "<p> Nom : {nom_classe} </p> ",
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

  const Siterenderer = {
    type: "simple", 
    symbol: {
      type: "simple-fill", 
      style: "solid",
      color: "#EEECF2",
      outline: {
        color: "#F3F2FF",
        width: 0.5,
      },
    },
  };

  let Site = new FeatureLayer({
    url: "https://services5.arcgis.com/KeHihixLGtBfk702/arcgis/rest/services/sites/FeatureServer",
    popupTemplate: popupSite,
    renderer: Siterenderer,
  });

  map.add(Site, 1);

  const sdaurenderer = {
    type: "simple", 
    symbol: {
      type: "simple-fill", 
      style: "solid",
      color: "#9D8099",
      outline: {
        color: "black",
        width: 0.5,
      },
    },
  };

  let sdau = new FeatureLayer({
    url: "https://services8.arcgis.com/TZdqWRQ4yVvV5k6R/arcgis/rest/services/sdau_wgs84/FeatureServer/0",
    popupTemplate: popupSdau,
    renderer: sdaurenderer,
  });

  map.add(sdau, 0);
  const gp = new Geoprocessor({
    url: "https://localhost:6443/arcgis/rest/services/SitePLUSproche/siteProche/GPServer",
  });

  const resultsLayer = new GraphicsLayer();
  map.add(resultsLayer);

  document.getElementById("runGPBtn").onclick = () => {
    const titreProjet = document.getElementById("titreProjet").value;
    const destinationSol = document.getElementById("destinationSol").value;

    const params = {
      TitreProjet: titreProjet,
      DestinationSol: destinationSol,
    };

    gp.execute(params).then(displayResult);
  };

  function displayResult(result) {
    console.log("Geoprocessing result:", result);

    resultsLayer.removeAll();

    result.results.forEach((r) => {
      if (r.value.features) {
        r.value.features.forEach((feature) => {
          const graphic = new Graphic({
            geometry: feature.geometry,
            attributes: feature.attributes,
            symbol: {
              type: "simple-marker",
              color: "red",
              size: "8px",
            },
            popupTemplate: {
              title: "{nom_classe}",
              content: [
                {
                  type: "fields",
                  fieldInfos: Object.keys(feature.attributes).map(
                    (fieldName) => ({
                      fieldName: fieldName,
                      label: fieldName,
                    })
                  ),
                },
              ],
            },
          });
          resultsLayer.add(graphic);
        });
      }
    });
  }
});
