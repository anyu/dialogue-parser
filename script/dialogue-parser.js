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
          // console.log('JSON result', JSON.stringify(result, null, 2));
          // console.log(result);
          var speech = locateKey(result, 'SPEECH');          
          // console.log('Speech: ', speech);
          countLinesPerSpeech(speech);
        }
      });
    });
    res.on('error', (err) => {
      console.log(err.message);
    });
  });
}

// Traverse JSON obj and find value by search term
// eg. grab value of 'SPEECH'
function locateKey(jsonObj, searchTerm) {
  if (typeof(jsonObj) !== 'object') {
    return null;
  }
  var result = null;

  if (jsonObj.hasOwnProperty(searchTerm)) {
    return jsonObj[searchTerm];
  } else {
    for (var key in jsonObj) {
      result = locateKey(jsonObj[key], searchTerm);
      if (result === null) continue;
      else break;
    }
  }
  return result;
}

// Count number of lines per character in ONE speech chunk
// a speech chunk ends when the next scene starts
function countLinesPerSpeech(speech) {
  var speechLines = {};
  speech.map((dialogue) => {
    var character = ''+ dialogue["SPEAKER"];
    if (speechLines[character]) {
      speechLines[character] += dialogue["LINE"].length;
    } else {
      speechLines[character] = dialogue["LINE"].length;
    }
  });
  console.log(speechLines)
}

// Sum total of lines per character
function totalLinesPerCharacter() {

}