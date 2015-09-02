var http  = require("http");
var https = require("https");
var fs    = require("fs");
var path  = require("path");
var url   = require("url");

var sqlDb = require('./sqliteDb.js');

var commonHeaders = {'Content-Type':'application/json'} ;


//Sql query to return items currently in the Fridge(assigned a quantity)
var sqlwQ =  "select Fridge.Name, Price.Price, Type.Category, Quantity.Quantity from Fridge join Price on Fridge.Name = Price.Name join type on Fridge.Name = Type.Name join Quantity on Quantity.Name = Price.Name;";
//Sql query to return all items irrespective of quantity
var sqlwoutQ = "select Item.Name, Price.Price, Type.Category from Item join Price on Item.Name = Price.Name join type on Item.Name = Type.Name;";


function ajaxserve(request,response, file){
  console.log("inside Ajax");

  //Submit New Item
  if(file=="/ajxItms"){
    console.log("Ajax: Sending new Regular Item");
    regItemSnd(request,response, Success);
  }
  //Respond with Current Regular Items list
  else if(file=="/ajxRegRtn"){
    console.log("Ajax: Get Regular Items list");
    regItemRtn(response);
  }
  //Clear Item, Price, Categories and Quantity Tables and regerate
  else if(file=="/ajxclrItems"){
    console.log("Ajax: Clearing saved Item properties");
    clrItems(response);
  }
  //Respond with current Fridge
  else if(file=="/ajxFridge"){
    console.log("Ajax: getting Fridge data");
    fridgeRtn(response);
  }
  //Clear Fridge
  else if(file=="/ajxclr"){
    console.log("Ajax: Clearing out the Fridge Data");
    clrFridge(response);
  }
  //Update Current List
  else if(file=="/ajxlistSnd"){
    console.log("Ajax: Updating the Grocery List");
    listUpdate(request,response);
  }
  //Respond with Current List
  else if(file=="/ajxlistRtn"){
    console.log("Ajax: Returning the Grocery List");
    listRtn(request,response);
  }
  //Submit List(PossTable)
  else if(file=="/ajxlistSub"){
    console.log("Ajax: Submitting item's to Fridge");
    listSubmit(request,response);
  }
  //Clear List(PossTable)
  else if(file=="/ajxlistClr"){
    console.log("Ajax: Clearing out the current List Items");
    clrList(response);
  }
  //Handle Other errors
  else{
    console.log("redirecting is not working");
    resHead(response);
    response.end("Error");
  }
}

//For accepting RegItem input and passing back most current table
function regItemSnd(request, response, callback){
  //Update Table with Request
  sqlDb.regItemInput(request);
  //Send SqlTable Response
  callback(response);
}
function regItemRtn(response){
  sqlDb.rtnValues(response, sqlwoutQ); //Return all Item classes(doesn't have to have a quantity/be in use)
}
function clrItems(response){
  var tables = ["Item", "Type", "Price", "Quantity"] ;
  sqlDb.clearTable(tables);
}
//The Fridge: Return Values, Clear All values
function fridgeRtn(response){
  sqlDb.rtnValues(response, sqlwQ); //Return with quantity (filter out items no input through the list)
}
function clrFridge(response){
  var tables = ["Fridge"] ;
  sqlDb.clearTable(tables);
}
//My List: Update, send back current saved list, clear current list
function listUpdate(request,response){
  sqlDb.upList(request);
  Success(response);
}
function listSubmit(request,response){
  sqlDb.SubmitPosList(request);
  Success(response);
}
function listRtn(request, response){
  resHead(response);
  sqlDb.getList(response);
}
function clrList(response){
  console.log("clrList: Clearing List table");
  var tables = ["PosList"] ;
  sqlDb.clearTable(tables);
}
//Misc
function resHead(response){
  response.writeHead(200,commonHeaders);
}
function Success(response){
  resHead(response);
  response.end("Success");
}


module.exports.ajaxserve = ajaxserve;
