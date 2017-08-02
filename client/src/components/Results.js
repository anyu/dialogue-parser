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
            <div className="charLineCount" key={index}>{character[1]} {character[0]}</div>
          )
        }): null}
      </div>
    )
  }
}

export default Results;
