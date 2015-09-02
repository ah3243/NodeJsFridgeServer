//DB Coursework


//import required modules

var http  = require("http");
var https = require("https");
var fs    = require("fs");
var path  = require("path");
var url   = require("url");


var sqlDb = require('./sqliteDb.js');
var ajx = require('./ajaxserver.js');

//html Views
var header = fs.readFileSync("../html/headerView.html");
var menu = fs.readFileSync("../html/menu.html");
var Fridge = fs.readFileSync("../html/index.html");
var RegItems = fs.readFileSync("../html/RegItems.html");
var MList = fs.readFileSync("../html/MyList.html");
var footer = fs.readFileSync("../html/footerView.html");


var commonHeaders = 'text/html' ;


// The default port numbers are the standard ones [80,443] for convenience.
// Change them to e.g. [8080,8443] to avoid privilege or clash problems.
var ports = [8080, 8443];

// Response codes: see http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
var OK = 200, Redirect = 307, NotFound = 404, BadType = 415;



/*---------------------------- Create Server -------------------------------------*/
//Create a Server on port 8080
function start(){

  http.createServer(function(request,response){

  serve(request,response);

  }).listen(8080,'127.0.0.1');
  console.log("server running at http://127.0.0.1:8080/");
}




/*------------------------------  Server function ---------------------------*/
function serve(request,response){
  var file = request.url;
  //var ajxlinks = /\/ajxFridge|\/ajxlistSnd|\/ajxlistSub|\/ajxlistRtn|\/ajxclr|\/ajxclrItems|\/ajxItms|\/ajxRegRtn|\/ajxlistClr/g;

  if(file=="/ajxFridge"|| file == "/ajxlistSnd" || file == "/ajxlistSub" || file == "/ajxlistRtn" || file=="/ajxclr" || file=="/ajxclrItems" || file=="/ajxItms" || file == "/ajxRegRtn" || file == "/ajxlistClr"){
    ajx.ajaxserve(request,response, file);
  }
  else if(file=="/"){
      console.log("home url detected"+file);
      writeHead(response,toFridge);
  }
  //Route to input function
  else if(file=="/RegularItems"){
      console.log("Going to see my check favorite items");
      writeHead(response, RegularItems);
  }
  //Route to input function
  else if(file=="/RegularItems/input"){
      console.log("Adding new Favorite items");
      inputNewItem(request,response);
      writeHead(response, RegularItems);
  }
  else if(file=="/MyFridge"){
      console.log("Off to check the Fridge\n");
      writeHead(response, toFridge);
  }
  else if(file=="/MyList"){
      console.log("Heading the Current Grocery List\n");
      writeHead(response, MyList);
  }
  //Catchall
  else{
    console.log("unable to match the extension correctly: "+file);
    writeHead(response,toFridge);
  }
}

/*------------------------------  Child functions ---------------------------*/

//clear sql Inventory table
function clearFridge(){
  sqlDb.clearTable();
}

//Returns the index views
function toFridge(response){
  //Redirect back to home(The Fridge)
  response.write(menu);
  response.write(Fridge);
  response.end(footer);
}

function RegularItems(response){
  response.write(menu);
  response.write(RegItems);
  response.end(footer);
}

function MyList(response){
  //Redirect back to home(The Fridge)
  response.write(menu);
  response.write(MList);
  response.end(footer);
}

//Input Routing Function
function inputNewItem(request, response){
  var body = getBody(request);
  //if(!isInput(body)){
  sqlDb.inputData(request, sqlDb.insertItem);
  writeHead(response,toFridge);
  //}
}

//write the generic html header's callback custom body
function writeHead(response, callback){
  response.writeHead(200,commonHeaders);
  response.write(header);
  callback(response);
}

start();







//
