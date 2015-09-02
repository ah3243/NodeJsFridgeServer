//Problem: We need a simple way to look at a users badge count and JavaScript points from profile
//Solution: use Node.js to perform the profile lookups and server our template via http

//1. Create a webserver

var http = require('http');
var util = require('util');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

var renderer = require('./renderer.js');
var renderer = require('./sqliteDb.js');

var commonHeaders = {'Content-Type':'text/plain'};


function serve(request,response){
  var file = request.url;
  if(file=="/"){
      response.writeHead(200, commonHeaders);
      response.write("This is now my awesome server");
      response.end();
  }
  if(file=="/login"){
    response.writeHead(200, commonHeaders);
    response.write("this is the login page");
    response.end();

  }
}


//2. Handle HTTP route GET / and POST / i.e home
function home(request,response){

    //if url ==="/" && GET
  if(request.url==="/"){

      //go to home
      response.writeHead(200,commonHeaders);
      renderer.view('headerView', {}, response);
      renderer.view('indexView',{},response);
      renderer.view('footerView',{},response);
      response.end();
  }
}

//3. Handle HTTP route GET /:username i.e /albert
function user(request,response){

  var username = request.url.replace('/', '');
  if(username == "quiz"){

      response.writeHead(200,commonHeaders);
      renderer.view('headerView', {}, response);
      renderer.view('ex-quizView',{},response);
      renderer.view('blankquizView',{},response);
      renderer.view('footerView',{},response);
      response.end();
    }
  }

  //Stock error function
  // .on("error", function(error){
  //   response.write(error.message + "\n");
  //   response.end("Footer \n");
  // });


module.exports.home = home;
module.exports.user = user;
module.exports.serve = serve;
