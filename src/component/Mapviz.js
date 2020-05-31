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
