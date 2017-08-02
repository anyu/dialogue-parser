import React from 'react';


class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
    this.captureInput = this.captureInput.bind(this);
  }

  captureInput(e) {
    this.setState({
      inputURL: e.target.value
    });
  }

  render() {
    return (
      <div className="Search">
        <h1>Dialogue Parser</h1>
        <div className="form_container">
          <form onSubmit={(e)=> this.props.submitURL(this.state.inputURL, e)}>
            <input type="text" placeholder="http://" onChange={this.captureInput}/>
            <button>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

export default Search;
