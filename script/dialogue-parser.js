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
          // var jsonText = JSON.stringify(result); 
          // console.log('JSON result', JSON.stringify(result, null, 2));
          // console.log(result);
          var speaker = locateKey(result, 'SPEAKER');
          console.log(speaker)
        }
      });
    });
    res.on('error', (err) => {
      console.log(err.message);
    });
  });
}


// Traverse JSON obj and find value by search term
// eg. grab value of 'SPEAKER'
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
