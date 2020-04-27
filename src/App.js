// React
import React, { Component } from 'react'

// App.Components
import Repository from './repository'

// App
export default class App extends Component {
  constructor () {
    super()
    this.state = { login: false }
  }

  routeForRepository (login, name) {
    return {
      title: `Login: ${login}/ Name: ${name}`,
      component: Repository,
      login: 'facebook',
      name: 'react'
    }
  }

  render () {
    // fetch from Github
    return  <Repository {...this.routeForRepository('facebook', 'react')} />
  }
}