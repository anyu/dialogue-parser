var http = require('http');
var xml2js = require('xml2js'),
parser = new xml2js.Parser();

var url = 'http://www.ibiblio.org/xml/examples/shakespeare/macbeth.xml';
dialogueParser(url);

// Retrieve XML data and convert to JSON
function dialogueParser(url) {
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
          var listOfSpeeches = locateKey(result, 'SPEECH');          
          countLinesPerSpeech(listOfSpeeches);
        }
      });
    });
    res.on('error', (err) => {
      console.log(err.message);
    });
  });
}

// Traverse JSON obj and find value by search term. Store results in array.
// eg. grab values of 'SPEECH'
function locateKey(jsonObj, searchTerm) {
  var storage = [];

  if (typeof(jsonObj) !== 'object') {
    return null;
  }
  if (jsonObj.hasOwnProperty(searchTerm)) {
    storage.push(jsonObj[searchTerm]);
    return jsonObj[searchTerm];
  } 
  for (var key in jsonObj) {
    storage = storage.concat(locateKey(jsonObj[key], searchTerm));
  }
  return storage;
}

// Sum up number of lines per character in each speech chunk
function countLinesPerSpeech(speech) {
  speech = speech.filter(Boolean);  // remove null values
  var speechLines = {};

  speech.map((dialogue) => {
    var character = ''+ dialogue["SPEAKER"];
    if (speechLines[character]) {
      speechLines[character] += dialogue["LINE"].length;
    } else {
      speechLines[character] = dialogue["LINE"].length;
    }
  });
  console.log(speechLines);
  return speechLines;
}
