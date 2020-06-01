'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const askGithub = require('./githubClient.js')
const {find_location} = require('./mapboxQuery.js')
const port = process.env.PORT || 8080
const https = require('https')
const {name_codes} = require('./name-code.js')
const path = require('path');

app.use(express.static('build'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'build', 'index.html'));
});

app.use(bodyParser.json());

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