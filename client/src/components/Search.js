import React from 'react';


class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputURL: ''
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
      <div className="search">
        <div className="form_container">
          <form onSubmit={(e)=> this.props.submitURL(this.state.inputURL, e)}>
            <input type="text" placeholder="Enter URL (must be an XML endpoint)" onChange={this.captureInput}/>
            <button>Submit</button>
          </form>
          { this.props.invalidURL ? 
            <div className="errMsg">Invalid URL. Please enter an XML endpoint.</div> : null
          }          
        </div>
      </div>
    )
  }
}

export default Search;
