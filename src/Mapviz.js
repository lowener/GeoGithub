// React
import React from 'react';
var countries_json = require('./countries.geo.json')


// MapViz
class MapViz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countries_json: countries_json
        }
    }

    render() {
        return (
        <div>
            
        </div>)
        }
    }
    
}
