import React from 'react';

import Search from './Search';
import Results from './Results';

const http = require('http');
const xml2js = require('xml2js'),
parser = new xml2js.Parser();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invalidURL: false,
      numLines: ''
    }
    this.submitURL = this.submitURL.bind(this);
    this.convertXMLtoJSON = this.convertXMLtoJSON.bind(this);
    this.processJSON = this.processJSON.bind(this);    
    this.findKey = this.findKey.bind(this);
    this.countLinesPerSpeech = this.countLinesPerSpeech.bind(this);
    this.toTitleCase = this.toTitleCase.bind(this);
    this.splitOnComma = this.splitOnComma.bind(this);
    this.orderByCount = this.orderByCount.bind(this);
  }

  submitURL(url, e) {
    e.preventDefault();
    this.convertXMLtoJSON(url);
  }

  convertXMLtoJSON(url) {
    http.get(url, (res) => {
      var data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
          data += chunk;
      });
      res.on('end', () => {
        parser.parseString(data, (err, result) => {
          if (err) {
            this.setState({
              invalidURL: true
            })
            console.log(err.message);
          } else {
            this.setState({
              invalidURL: false
            })
            this.processJSON(result);
          }
        });
      });
      res.on('error', (err) => {
        console.log(err.message);
      });
    });
  }

  processJSON(jsonData) {
    var listOfSpeeches = this.findKey(jsonData, 'SPEECH');          
    var linesPerSpeech = this.countLinesPerSpeech(listOfSpeeches);
    var ordered = this.orderByCount(linesPerSpeech);
    this.setState({
      numLines: ordered
    })
  }

  findKey(jsonObj, searchTerm){
    var storage = [];
    
    if (typeof(jsonObj) !== 'object') {
      return null;
    }
    if (jsonObj.hasOwnProperty(searchTerm)) {
      storage.push(jsonObj[searchTerm]);
    } 
    for (var key in jsonObj) {
      storage = storage.concat(this.findKey(jsonObj[key], searchTerm));
    }
    storage = storage.filter(Boolean); // remove null values
    return storage;
  }

  // Sum up number of lines per character in each speech chunk
  countLinesPerSpeech(speech) {
    var speechLines = {};
    for (var i = 0; i < speech.length; i++) {
      speech[i].map((dialogue) => {
        var character = ''+ dialogue["SPEAKER"];
        character = this.toTitleCase(character);
        if (speechLines[character]) {
          speechLines[character] += dialogue["LINE"].length;
        } else {
          speechLines[character] = dialogue["LINE"].length;
        }
      });
    }

    // account for characters talking at same time
    for (var character in speechLines) {
      if (character.indexOf(',') > -1) {
        var multipleSpeakers = this.splitOnComma(character);
        for (var i = 0; i < multipleSpeakers.length; i++) {
          speechLines[this.toTitleCase(multipleSpeakers[i])] += speechLines[character];
        }
        delete speechLines[character]; 
      } 
      // filter out 'All' speakers
      delete speechLines['All']; 
    }
    return speechLines;
  }

  toTitleCase(name) {
    var formattedName = name.toLowerCase().split(' ')
    .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
    .join(' ')
    return formattedName;
  }

  // Split string by comma
  splitOnComma(str) {
    var words = str.split(',');
    return words;
  }

  // Sort number of lines, descending
  orderByCount(obj) {
    var sortable = [];
    for (var character in obj) {
      sortable.push([character, obj[character]]);
    }
    sortable.sort((a, b) => {
      return b[1] - a[1];
    });
    return sortable;
  }

  render() {
    return (
      <div className="container">
        <div className="accent"></div>
          <span className="tinyNav"><a href="https://github.com/anyu/dialogue-parser" target="blank">github</a></span>
        <div className="innerContainer">
          <h1>Dialogue Parser</h1>
          <h3>Who talked the most in Shakespearan plays? Find out right now.</h3>
          <Search submitURL={this.submitURL} invalidURL={this.state.invalidURL} />
          { this.state.numLines ? 
            <Results numLines={this.state.numLines}/> : null 
          }
        </div>
      </div>
  )}
}


export default App;
