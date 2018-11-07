import React, { Component } from "react";

class Home extends Component {
  login() {
    this.props.auth.login();
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        <h1>Welcome to Tweeties</h1>
        <div>
          <form>
            <textarea placeholder="Enter your tweet here" />
            <button type="submit">Twwet</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Home;
