var http = require('http');
var xml2js = require('xml2js'),
parser = new xml2js.Parser();

dialogueParser();


function dialogueParser() {
  var url = 'http://www.ibiblio.org/xml/examples/shakespeare/macbeth.xml';

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
          console.log(result);
        }
      });
    });
    res.on('error', (err) => {
      console.log(err.message);
    });
  });
}