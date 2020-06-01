// React
import React from 'react';
import { get_places } from './ask_server';

// Repository
class Repository extends React.Component {
  constructor(props) {
    super(props);

    // states
    this.state = {
      login: props.login ? props.login : "facebook",
      name: props.name ? props.name : "react",
      locations: [],
    };
    this.handleChangeLogin = this.handleChangeLogin.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillReceiveProps(newProps) {
    // DRY
    const repo = newProps.data.repository.ref.target.history.edges;


    // states
    this.setState({
      login: this.props.login,
      name: this.props.name,
      locations: repo.map(element => element.node.author.user.location)
    });
  }

  handleChangeLogin(event) {  
    this.setState({login: event.target.value});  
  }

  handleChangeName(event) {  
    this.setState({name: event.target.value});  
  }

  onSubmit(event) {
    event.preventDefault();
    get_places(this.state).then(value =>{
      this.setState({locations: value})
    })
    
  }

  countLocation(list) {
    // Word count
    var words = {};
    for(var i = 0; i < list.length; i++) {
        var word = list[i];
        if (words.hasOwnProperty(word)) {
            words[word]++;
        } else {
            words[word] = 1;
        }
    }
    return words;
}

  render() {
    return (
    <div id="repoid">
      <form  onSubmit={this.onSubmit}>
        <label>
          Login: <input id="text-login" type="text" value={this.state.login} onChange={this.handleChangeLogin}/>
        </label>
        <h2> </h2>
        <label>
          Name: <input id="text-name" type="text" value={this.state.name} onChange={this.handleChangeName}/>
        </label>
        <h2> </h2>
        <input id="btn-submit" type="submit"/>
      </form>
      <h2>{this.state.login}/{this.state.name}</h2>
      <ul>
        <li>Locations: {this.state.locations.toLocaleString()}</li>
      </ul>
    </div>)
  }
}

const RepositoryWithInfo = Repository;
export default RepositoryWithInfo;