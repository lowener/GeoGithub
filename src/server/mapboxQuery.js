const https = require('https')
const {name_codes} = require('./name-code.js')

var geomaptoken = ''

if (process.env.tokenGeomap) {
    geomaptoken = process.env.tokenGeomap
}
else {
    fs.readFile('tokenMapbox.txt', 'utf8', function(err, contents) {
        geomaptoken = contents;
        console.log(`Mapbox API Token loaded `)
    });
    
}

function formatGeo(data) {

    const features = JSON.parse(data).features

    if (features.length === 0) return null

    const [ location ] = features
    const { context } = location
    let country = null
    let countryCode = null

    if (Array.isArray(context) && context.length > 0) {

        const countryObj = context[context.length - 1]
        
        country = countryObj.text || ''
        countryCode = countryObj.short_code.toUpperCase() || ''
        countryCode = name_codes[countryCode]
    } else {

        country = location.text // Assume that if location.context is empty, name is a country name
        countryCode = location.short_code // Assume that if location.context is empty, name is a country name
        countryCode = name_codes[countryCode]
    }

    return {
        /// name: location.text,
        "Country": country,
        "CountryCode": countryCode
    }

}

async function find_location(location, cb) {
    const location_safe = location.replace(/;/g, ',')
    const geomapurl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
    const req = https.get(geomapurl + `${location_safe}.json?access_token=${geomaptoken}`, res => {
        let data = '';

        // A chunk of data has been recieved.
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            cb(formatGeo(data))
        });
    })
    req.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    req.end()
}

module.exports = {
    find_location: find_location
}