// React
import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import countries_json from './countries.geo.json'


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
    }

    init(id) {
        let map = L.map(id)
    }

    componentDidMount() {
        //if (!this.state.map) this.init(this._mapNode);
    }
    componentDidUpdate(prevProps, prevState) {
        // code to run when the component receives new props or state
        // check to see if geojson is stored, map is created, and geojson overlay needs to be added
        if (this.state.countries_json && this.state.map && !this.state.geojsonLayer) {
          // add the geojson overlay
          this.addGeoJSONLayer(this.state.countries_json);
        }
        /*
        // check to see if the subway lines filter has changed
        if (this.state.subwayLinesFilter !== prevState.subwayLinesFilter) {
          // filter / re-render the geojson overlay
          this.filterGeoJSONLayer();
        }*/
      }


    addGeoJSONLayer(geojson) {
        // create a native Leaflet GeoJSON SVG Layer to add as an interactive overlay to the map
        // an options object is passed to define functions for customizing the layer
        const geojsonLayer = L.geoJson(geojson, {
          //onEachFeature: this.onEachFeature,
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

    render() {
        return (
            this.state.countries_json ?
            <div id="mapid">
            <Map
                center={[this.state.lat, this.state.lng]} 
                zoom={this.state.zoom} 
                style={{ width: '100%', height: '500px'}}
            >
            <TileLayer
                attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            </Map>
            </div>
            :
            'Data is loading...'
            )
    }
}
