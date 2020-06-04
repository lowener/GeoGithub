// React
import React, { Component } from 'react'

// App.Components
import Repository from './component/repository'
import MapViz from './component/Mapviz.js'

// App
export default class App extends Component {
  constructor () {
    super()
    this.state = { 
      login: false, 
      countryState: null 
    }
    this.cbUpdateChildRepo = this.cbUpdateChildRepo.bind(this)
  }

  routeForRepository (login, name) {
    return {
      title: `Login: ${login}/ Name: ${name}`,
      component: Repository,
      login: 'facebook',
      name: 'react'
    }
  }

  cbUpdateChildRepo(newCountryState) {
    this.setState({countryState: newCountryState})
  }

  componentDidUpdate(prevProps, prevState) {
    this.MapVizRef.getData(this.state.countryState)
  }

  render () {
    // fetch from Github
    return  (
    <div id="MyAppJS">
      <Repository {...this.routeForRepository('facebook', 'react')} cbUpdateRepo={this.cbUpdateChildRepo}/>
      <MapViz ref={(MapVizRef) => { this.MapVizRef = MapVizRef; }}/>
    </div>
    );
  }
}