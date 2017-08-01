import React from 'react';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputURL: ''
    }
    this.captureInput = this.captureInput.bind(this);
    this.submitURL = this.submitURL.bind(this);
  }

  captureInput(e) {
    console.log(e.target.value)
    this.setState({
      inputURL: e.target.value
    });
  }

  submitURL(url, e) {
    e.preventDefault();
    console.log('search submitted' + url); 
  }

  render() {
    return (
      <div className="container">
        <h1>Dialogue Parser</h1>
        <div className="form_container">
          <form onSubmit={(e)=> this.submitURL(this.state.inputURL, e)}>
            <input type="text" placeholder="Enter URL" onChange={this.captureInput}/>
            <button>Submit</button>
          </form>
        </div>
      </div>
  )}
}


export default App;
