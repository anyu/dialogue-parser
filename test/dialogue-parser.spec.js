const chai = require('chai');
const sinon = require('sinon');
const expect = require('chai').expect;

const server = require('../server/server');
const dialogueParser = require("../script/dialogue-parser");


describe('Dialogue Parser', function() {

  //Tests convertXMLtoJSON function
  it('should call processJSON on success', function() {
    var url = 'http://www.ibiblio.org/xml/examples/shakespeare/macbeth.xml';
    const spy = sinon.spy();
    sinon.stub(dialogueParser,'processJSON').callsFake(spy);
    dialogueParser.convertXMLtoJSON(url);
    expect(spy).called;
  });

  // Tests findKey function
  it('should find all values of search term key in a nested JSON object', function() {
    var jsonObj = { "id": "0001","type": "donut","name": "Cake","topping":
                 [{ "id": "5002", "type": "Glazed" },{ "id": "5005", "type": "Sugar" },
                     { "id": "5007", "type": "Powdered Sugar" },{ "id": "5006", "type": "Chocolate with Sprinkles" },
                     { "id": "5003", "type": "Chocolate" },{ "id": "5004", "type": "Maple" }
                 ]};
    var justTypes = ['donut','Glazed','Sugar','Powdered Sugar','Chocolate with Sprinkles','Chocolate','Maple'];
    var searchTerm = 'type';
    var result = dialogueParser.findKey(jsonObj,searchTerm);
    expect(result).to.deep.equal(justTypes)
  });

  // Tests countLinesPerSpeech function
  it('should sum up number of lines per character in each speech chunk', function() {
    var arr = [ [
        { SPEAKER: ["Eric"], LINE: ["Fun in the sun."] },
        { SPEAKER: ["Evangeline"], LINE: ["Totally"] },
        { SPEAKER: ["Emilie"], LINE: ["Cool story", "No really"] }
    ]];
    var result = dialogueParser.countLinesPerSpeech(arr);
    expect(result["Emilie"]).to.equal(2)
  });

  // Tests toTitleCase function
  it('should format words to title case', function() {
    var oneWord = "ravioli"
    var multiWord = "mister ravioli"
    var oneWordTitleCased = dialogueParser.toTitleCase(oneWord);
    var multiWordTitleCased = dialogueParser.toTitleCase(multiWord);
    expect(oneWordTitleCased).to.equal("Ravioli");
    expect(multiWordTitleCased).to.equal("Mister Ravioli");
  });

    // Tests orderByCount function
  it('should order contents of object by descending value order', function() {
    var unsorted = { 'Bean Friend': 2,
                    'Eric': 45,
                    'Alfalfa': 15,
                    'Evangeline': 89,
                    'Emilie': 20
                };
    var sorted = [ [ 'Evangeline', 89 ],
                [ 'Eric', 45 ],
                [ 'Emilie', 20 ],
                [ 'Alfalfa', 15 ],
                [ 'Bean Friend', 2 ]
                ];
    expect(dialogueParser.orderByCount(unsorted)).to.deep.equal(sorted);
  });
});
