'use strict'

const app = require('express')();
const bodyParser = require('body-parser');
const askGithub = require('./githubClient.js')
const find_location = require('./mapboxQuery.js').find_location
const port = process.env.PORT || 8080
const https = require('https')
const name_codes = require('./name-code.js').name_codes

app.use(bodyParser.json());

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
    const geomaptoken = 'pk.eyJ1IjoibG93ZW5lciIsImEiOiJjazlxM3A2ZzcwZ3ByM2hwOXhlanZ1c3VrIn0.5etTr_TSPN80TpjMfez8eA'
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

app.get('/get_country/:id', (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', 'access-control-allow-origin,allowedorigins,content-type')
    find_location(req.params.id, (location) => {
        res.status(200).send(location)
    });
    //next();
})


app.post('/ask', (req, res) => {
    req.accepts('application/json')
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', 'access-control-allow-origin,allowedorigins,content-type')
    console.log(req.body)

    async function sendres() {
        var githubAnswer = await askGithub.askGithub(req.body)
        githubAnswer = githubAnswer.map(value => value.node.author.user.location)
                                   .filter(value => value != null)
        console.log(githubAnswer)
        res.status(200).send({login: "facebook", name: "react", locations: githubAnswer});
    }

    sendres();
    
});

app.options('/ask', (req, res) => {
    res.set('Content-Type', 'application/json')
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', 'access-control-allow-origin,allowedorigins,content-type')
    res.status(200).send();
});

//find_location('Belgrade', res => console.log(res))

app.listen(port, () => console.log(`App listening on port ${port}!`));