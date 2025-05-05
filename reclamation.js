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
  "esri/widgets/Expand",
  "esri/widgets/Search",
  "esri/widgets/LayerList",
  "esri/layers/GraphicsLayer",
  "esri/geometry/Point",
  "esri/Graphic",
  "esri/widgets/Editor",
  "esri/widgets/Sketch/SketchViewModel",
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
  Expand,
  Search,
  LayerList,
  GraphicsLayer,
  Point,
  Graphic,
  Editor,
  SketchViewModel
) {
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurHrQeGD5XEElaNsfXf8FyqVbkD2VbnkX2XtA8WgtAqjKgjXb1meDzQv9r8cB2QvTeVX5kqr22z4P1jUR8TkSHH7aFvEn5frK-1cRQng5cPHGqn4AePXkSQQFMw1sEQC3ME_gexE8bqev5BTG-BOeUb2kkEhoDuWxgfX46C_gzmRjMfXZgiFsCBQYnsB00DdcjOy4xSJ7_bBgYqyakp6hjd_5I6u8GVRvsmWoo4OmFNvqAT1_szgXgvkg";

  const coucheGraphique = new GraphicsLayer();

  let recrenderer = {
    type: "simple",
    symbol: {
      type: "simple-marker",
      size: 10,
      color: "#AB47A3",
      outline: {
        width: 0.5,
        color: "white",
      },
    },
  };

  let Reclamation = new FeatureLayer({
    url: "https://services5.arcgis.com/KeHihixLGtBfk702/arcgis/rest/services/Reclamation_wgs/FeatureServer",
    renderer: recrenderer,
    geometryType: "point",
  });

  const map = new Map({
    basemap: "streets-navigation-vector",
    layers: [coucheGraphique, Reclamation],
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
    container: "viewDivv",
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
      expandTooltip: "Légende",
    }),
    "bottom-right"
  );

  view.ui.add(
    new Expand({
      view: view,
      content: layerList,
      expandIconClass: "esri-icon-layers",
      expandTooltip: "Liste des couches",
    }),
    "top-right"
  );

  let mybasemapG = new BasemapGallery({ view: view, nextBasemap: "topo" });

  var basemapExpand = new Expand({
    view: view,
    content: mybasemapG,
    expandIconClass: "esri-icon-basemap",
    expandTooltip: "Galerie de fonds de carte",
  });

  view.ui.add(basemapExpand, { position: "top-right" });

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
    url: "https://services5.arcgis.com/KeHihixLGtBfk702/arcgis/rest/services/Communes/FeatureServer",
    outFields: ["PREFECTURE", "COMMUNE_AR", "Shape_Area"],
    popupTemplate: popupCommune,
    renderer: commrenderer,
  });

  map.add(Commune, 0);

  const projeBtn = document.getElementById("projeBtn");
  view.ui.add(projeBtn, "bottom-left");

  const editor = new Editor({
    view: view,
    layerInfos: [
      {
        layer: Reclamation,
        formTemplate: {
          elements: [
            { type: "field", fieldName: "Objet", label: "Objet" },
            { type: "field", fieldName: "Message", label: "Message" },
            { type: "field", fieldName: "Demarche_d", label: "Demarche_d" },
            { type: "field", fieldName: "Mail", label: "Mail" },
          ],
        },
      },
    ],
    deleteEnabled: false,
  });

  view.ui.add(editor, "top-right");

  view.when(() => {
    const sketchVmodel = new SketchViewModel({
      layer: coucheGraphique,
      view: view,
      pointSymbol: {
        type: "simple-marker",
        color: "blue",
        size: 8,
        outline: { color: "white", width: 1 },
      },
    });

    sketchVmodel.on("create", (event) => {
      if (event.state === "complete") {
        let newPoint = new Graphic({
          geometry: event.graphic.geometry,
          symbol: sketchVmodel.pointSymbol,
          attributes: {},
        });

        coucheGraphique.remove(event.graphic);
        coucheGraphique.add(newPoint);

        Reclamation.applyEdits({
          addFeatures: [newPoint],
        });
      }
    });

    projeBtn.onclick = () => {
      sketchVmodel.create("point");
    };

    view.on("click", ["Control", "Shift"], (event) => {
      view.hitTest(event).then((response) => {
        if (response.results.length > 0) {
          let selectedGraphic = response.results[0].graphic;
          Reclamation.applyEdits({
            deleteFeatures: [selectedGraphic],
          });
          coucheGraphique.remove(selectedGraphic);
        }
      });
    });
  });
});
