/*********************************************************************************************
 
Command-line script that prints out the number of lines each character speaks in Macbeth.
Usage: node script/dialogue-parser.js

/*********************************************************************************************/

var http = require('http');
var xml2js = require('xml2js'),
parser = new xml2js.Parser();

var url = 'http://www.ibiblio.org/xml/examples/shakespeare/macbeth.xml';


// Kick off parsing process
exports.initiateParse = (url) => {
  this.convertXMLtoJSON(url);
}

// Retrieve XML data and convert to JSON
exports.convertXMLtoJSON = (url) => {
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

// Call functions to process JSON data
exports.processJSON = (jsonData) => {
  var listOfSpeeches = this.findKey(jsonData, 'SPEECH');          
  var linesPerSpeech = this.countLinesPerSpeech(listOfSpeeches);
  var ordered = this.orderByCount(linesPerSpeech);
  this.printToConsole(ordered);
}

// Traverse JSON obj and find value by search term. Store results in array.
// eg. grab values of 'SPEECH'
exports.findKey = (jsonObj, searchTerm) => {
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
exports.countLinesPerSpeech = (speech) => {
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


/******************************* Utility helper functions ************************/

exports.toTitleCase = (name) => {
  var formattedName = name.toLowerCase().split(' ')
   .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
   .join(' ')
  return formattedName;
}

// Split string by comma
exports.splitOnComma = (str) => {
  var words = str.split(',');
  return words;
}

// Sort number of lines, descending
exports.orderByCount = (obj) => {
  var sortable = [];
  for (var character in obj) {
    sortable.push([character, obj[character]]);
  }
  sortable.sort((a, b) => {
    return b[1] - a[1];
  });
  return sortable;
}

exports.printToConsole = (arr) => {
  arr.map((pair) => {
    console.log(pair[1] + ' ' + pair[0]);
  })
}


/******************************* Main ************************/

this.initiateParse(url);
