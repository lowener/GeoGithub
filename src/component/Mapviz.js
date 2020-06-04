// React
import React from 'react';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import countries_json from './countries.geo.json'
import RepositoryWithInfo from './repository'


let config = {};
config.params = {
  center: [30,0],
  zoomControl: false,
  zoom: 10,
  maxZoom: 19,
  minZoom: 1,
  scrollwheel: false,
  legends: true,
  infoControl: false,
  attributionControl: true
};
config.tileLayer = {
  uri: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  params: {
    minZoom: 1,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    id: '',
    accessToken: ''
  }
};

// MapViz
export default class MapViz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countries_json: countries_json,
            lat: 0,
            lng: 0,
            zoom: 3,
            scrollwheel: false,
        }
        this._mapNode = null;
        this.highlightFeature = this.highlightFeature.bind(this)
        this.resetHighlight = this.resetHighlight.bind(this)
        this.onEachFeature = this.onEachFeature.bind(this)
    }

    init(id) {
       if (this.state.map) return
        let map = L.map(id, config.params)
        L.control.zoom({ position: "bottomleft"}).addTo(map);
        L.control.scale({ position: "bottomleft"}).addTo(map);
    
        // a TileLayer is used as the "basemap"
        const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);
        
      this.setState({ map, tileLayer });
    }

    getData(newLocations) {
      //Reset geoJson data
      for (var geoCountry in this.state.countries_json.features){
        this.state.countries_json.features[geoCountry].properties.nbCommit = 0
      }

      //Process new data
      var countryLocations = newLocations
      for (const country in countryLocations){
        const countriesMatched = this.state.countries_json.features.filter(
          (elt) => elt.id === country
        )
        if (countriesMatched.length !== 1){
          console.log("Country '" + country + "' NOT matched...")
        }
        else {
          countriesMatched[0].properties.nbCommit = countryLocations[country]
        }
      }
      //register new state
      this.setState({
        countryLocations: countryLocations,
      })
    }

    componentDidMount() {
        if (!this.state.map) this.init(this._mapNode);
    }

    addControlLayer(){
      var info = L.control();
      info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
      }
      // method that we will use to update the control based on feature properties passed
      info.update = function (props) {
        this._div.innerHTML = '<h4>Number of commits</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.nbCommit + ' commits'
            : 'Hover over a state');
      };

      info.addTo(this.state.map);
      this.setState({info})
    }

    componentDidUpdate(prevProps, prevState) {
      // code to run when the component receives new props or state
      // check to see if geojson is stored, map is created, and geojson overlay needs to be added
      if (this.state.countries_json && this.state.map && !this.state.geojsonLayer) {
        // add the geojson overlay
        this.addGeoJSONLayer(this.state.countries_json);
        this.addControlLayer()
      }
      /*
      // check to see if the subway lines filter has changed
      if (this.state.subwayLinesFilter !== prevState.subwayLinesFilter) {
        // filter / re-render the geojson overlay
        this.filterGeoJSONLayer();
      }*/
    }

    zoomToFeature(target) {
      // pad fitBounds() so features aren't hidden under the Filter UI element
      var fitBoundsParams = {
        paddingTopLeft: [0,0],
        paddingBottomRight: [0,0]
      };
      // set the map's center & zoom so that it fits the geographic extent of the layer
      this.state.map.fitBounds(target.getBounds(), fitBoundsParams);
    }

    addGeoJSONLayer(geojson) {
      // create a native Leaflet GeoJSON SVG Layer to add as an interactive overlay to the map
      // an options object is passed to define functions for customizing the layer
      const geojsonLayer = L.geoJson(geojson, {
        onEachFeature: this.onEachFeature,
        //pointToLayer: this.pointToLayer,
        //filter: this.filterFeatures
      });
      // add our GeoJSON layer to the Leaflet map object
      geojsonLayer.addTo(this.state.map);
      // store the Leaflet GeoJSON layer in our component state for use later
      this.setState({ geojsonLayer });
      // fit the geographic extent of the GeoJSON layer within the map's bounds / viewport
      this.zoomToFeature(geojsonLayer);
    }

    onEachFeature(feature, layer) {
      layer.on({
          mouseover: this.highlightFeature,
          mouseout: this.resetHighlight
      });
    }

    resetHighlight(e) {
      this.state.geojsonLayer.resetStyle(e.target);
      this.state.info.update();
    }

    highlightFeature(e) {
      var layer = e.target;
  
      layer.setStyle({
          weight: 2,
          color: '#f40a12',
          dashArray: '',
          fillOpacity: 0.7
      });
  
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
      }
      this.state.info.update(layer.feature.properties);
  }

    render() {
        return (
            this.state.countries_json ?
            
            <div ref={(node) => this._mapNode = node} id="mapid"/>
            :
            'Data is loading...'
            )
    }
}