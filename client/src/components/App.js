import React from 'react';

import Search from './Search';
import Results from './Results';
import Footer from './Footer';

const http = require('http');
const xml2js = require('xml2js'),
parser = new xml2js.Parser();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputURL: '',
      numLines: ''
    }
    this.submitURL = this.submitURL.bind(this);
    this.processJSON = this.processJSON.bind(this);    
    this.findKey = this.findKey.bind(this);
    this.countLinesPerSpeech = this.countLinesPerSpeech.bind(this);
    this.toTitleCase = this.toTitleCase.bind(this);
    this.orderByCount = this.orderByCount.bind(this);
  }

  submitURL(url, e) {
    e.preventDefault();
    http.get(url, (res) => {
      var data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
          data += chunk;
      });
      res.on('end', () => {
        parser.parseString(data, (err, result) => {
          if (err) {
            console.log(err.message);
          } else {
            this.processJSON(result);
          }
        });
      });
      res.on('error', (err) => {
        console.log(err.message);
      });
    });
  }

  findKey(jsonObj, searchTerm) {
    var storage = [];

    if (typeof(jsonObj) !== 'object') {
      return null;
    }
    if (jsonObj.hasOwnProperty(searchTerm)) {
      storage.push(jsonObj[searchTerm]);
      return jsonObj[searchTerm];
    } 
    for (var key in jsonObj) {
      storage = storage.concat(this.findKey(jsonObj[key], searchTerm));
    }
    return storage;
  }

  countLinesPerSpeech(speech) {
    speech = speech.filter(Boolean);  // remove null values
    var speechLines = {};

    speech.map((dialogue) => {
      var character = ''+ dialogue["SPEAKER"];
      character = this.toTitleCase(character);
      if (speechLines[character]) {
        speechLines[character] += dialogue["LINE"].length;
      } else {
        speechLines[character] = dialogue["LINE"].length;
      }
    });
    return speechLines;
  }

  toTitleCase(name) {
    var formattedName = name.toLowerCase().split(' ')
    .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
    .join(' ')
    return formattedName;
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

  processJSON(jsonData) {
    var listOfSpeeches = this.findKey(jsonData, 'SPEECH');          
    var linesPerSpeech = this.countLinesPerSpeech(listOfSpeeches);
    var ordered = this.orderByCount(linesPerSpeech);
    this.setState({
      numLines: ordered
    })
  }

  render() {
    return (
      <div className="container">
        <div className="accent"></div>
        <div className="innerContainer">
          <h1>Dialogue Parser</h1>
          <h3>Ever wonder how many lines each character in a Shakespearan play says?</h3>
          <Search submitURL={this.submitURL}/>
          { this.state.numLines ? 
            <Results numLines={this.state.numLines}/> : null 
          }
        </div>
        <Footer/>
      </div>
  )}
}


export default App;
