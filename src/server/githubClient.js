'use strict'

const GraphQLClient = require('graphql-request')
const fs = require('fs');

const apiEndPoint = "https://api.github.com/graphql"
const client = new GraphQLClient.GraphQLClient(apiEndPoint, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
});
var tokenAPI = ''

if (process.env.tokenGithub) {
  tokenAPI = process.env.tokenGithub
}
else {
  fs.readFile('token.txt', 'utf8', function(err, contents) {
      tokenAPI = contents;
      client.setHeader('Authorization', `Bearer ${tokenAPI}`)
      console.log(`Github API Token loaded `)
  });
}

const GetRepositoryInfoQuery = /* GraphQL */`
  query GetRepositoryIssues($name: String!, $login: String!) {
    repository(name: $name, owner: $login) {
        ref(qualifiedName: "refs/heads/master") {
            target {
                ... on Commit {
                    history {
                    edges {
                        node {
                            author {
                                date
                                user {
                                    location
                                }
                            }
                        }
                    }
                    }
                }
            }
        }
    }
  }
`;




async function askGithub(state) {
  
  var x =  client.request(GetRepositoryInfoQuery, state)
  return x.then(data => {
          return data.repository.ref.target.history.edges
        })
        .catch(err => {
          console.log(err)
          console.log(err.response.errors)
          console.log(err.response.data)
        })

}

module.exports = {
 askGithub: askGithub
}