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
      </div>
    );
  }
}

export default Home;
