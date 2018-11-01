// Sample webhook showing what a hasura auth webhook looks like

// init project
var express = require("express");
var app = express();

var requestClient = require("request");

/*
  Auth webhook handler for auth0
  Flow:
  1) Expects access_token to be sent as 'Authorization: Bearer <access-token>
  2) Verified access_token by fetching /userinfo endpoint from auth0
  
  Usage:
  1) From your application, when you call Hasura's GraphQL APIs remember to send the access_token from auth0 as an authorization header
  2) Replace the url (https://test-hasura.auth0.com/userinfo) in the code below with your own auth0 app url
*/
app.get("/auth0/webhook", (request, response) => {
  var token = request.get("Authorization");

  if (!token) {
    response.status(401).send("No authorization token");
  } else {
    // Fetch information about this user from
    // auth0 to validate this token
    // NOTE: Replace the URL with your own auth0 app url
    var options = {
      url: "https://test-hasura.auth0.com/userinfo",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    };

    requestClient(options, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        var userInfo = JSON.parse(body);
        console.log(userInfo);
        //
        var hasuraVariables = {
          "X-Hasura-User-Id": userInfo.sub,
          "X-Hasura-Role": "user"
        };
        console.log(hasuraVariables); // For debug
        response.json(hasuraVariables);
      } else {
        // Error response from auth0
        console.log(err, res, body);
        response.status(401).send("Invalid response from auth0");
      }
    });
  }
});

/* A simple sample
   Flow:
   1) Extracts token
   2) Fetches userInfo in a mock function
   3) Return hasura variables
*/
function fetchUserInfo(token, cb) {
  // This function takes a token and then makes an async
  // call to the session-cache or database to fetch
  // data that is needed for Hasura's access control rules
  cb();
}
app.get("/simple/webhook", (request, response) => {
  // Extract token from request
  var token = request.get("Authorization");

  // Fetch user_id that is associated with this token
  fetchUserInfo(token, result => {
    // Return appropriate response to Hasura
    var hasuraVariables = {
      "X-Hasura-Role": "user", // result.role
      "X-Hasura-User-Id": "1" // result.user_id
    };
    response.json(hasuraVariables);
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
