import React from 'react';


class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="results">
        {this.props.numLines ? this.props.numLines.map((character, index) => {
          return (
            <div className="charLineCount" key={index}>
              <span className="lineCount">{character[1]}</span> 
              <span className="character">{character[0]}</span>
            </div>
          )
        }): null}
      </div>
    )
  }
}

export default Results;
