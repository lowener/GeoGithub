'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const askGithub = require('./githubClient.js')
const port = process.env.PORT || 8080

const app = express();

app.use(bodyParser.json());
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

app.listen(port, () => console.log(`App listening on port ${port}!`));