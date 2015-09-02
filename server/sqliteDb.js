//Build and manage SQLite database


//Require files
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var ajx = require('./ajaxserver.js');

//Check for and Create file
var file =  "./test.db";

var exists = fs.existsSync(file);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
  }

var db = new sqlite3.Database(file);

var commonHeaders = {'Content-Type':'text/html'};
//case insensitive modifier for replacing input names
var inputNames = /weight=|item=|price=|category=|quantity=/g;
var strspace = /\+/g;

inputDatacallback();



  function getData(request,flag, callback){
    var fullbody ="";
    var method = request.method.toUpperCase();
    if(method=="POST"){
      //Accumulate all data in str variable
      request.on('data', function(chunk){
        fullbody+= chunk.toString();});
      //On End extract input from string
      request.on('end',function(){
        //on end remove label names leaving inputs
        fullbody = fullbody.replace(inputNames,"");
        fullbody = fullbody.replace(strspace ," ");
        fullbody = fullbody.split("&");

        console.log("getData: This is your data before split:"+fullbody);

        //give input to callback for processing
        callback(fullbody, flag);
      });
    }else{console.log("getData: Incorrect method entered please check submit methods: "+method);}
  }

  //input new data
  function inputData(request, func){

      //Return if table not yet created
      if(!exists){
        return false;
      }
      //Start function calls
      getData(request,"",func);
  }

//                          GROCCERY(POSS) LIST ITEMS                  //

//Routes request through Getdata then onto updList to insert
function upList(request){
  getData(request,"",updList);
}
//Takes retreived data, confirms it is not void, then inserts to PosList catching errors
function updList(data){
  if(data.length===2){

    db.run("INSERT INTO PosList VALUES(NULL, ?)",data[0], function(err){
      if(err)console.log("updList: PosList Name insert: Fail "+ err+data[0]);
      else{
        console.log("updList: List updated");
      }
    });

    //Retreived data inserted into Quantity
    db.run("INSERT INTO Quantity VALUES(?,?)",data[0],data[1],function(err){
      if(err){console.log("updList: Quantity insert Fail "+ err+data[0]);
      }else{
        console.log("updList: Quantity updated");
      }
    });

  }else {console.log("updList: Error, list input not correct length: "+data.length);}
}

function getList(response){
  var cnt = 0;
  var str = "[";
  db.each("select PosList.Name, Quantity.Quantity from Quantity join PosList on Quantity.Name = PosList.Name;",

  //Individual Row Callback
  function(err,results){
    if(err){console.log("getList: there was an error retreiving List: "+err);}
    else if(results.Name !== null && results.LID !==null){
     //To add front comma to make valid JSON
     if(cnt>0)str+=",";
     cnt++;

     //format the name data in var
     str += '{ "Name" : "'+results.Name+'","Quantity" : "'+results.Quantity+'" }';

   }else{console.log("getList: Error Getting list, LID and or Name == Null: "+results.Name+ results+LID);}
  },
  //Completion Callback
  function(){
    str += "]";
    console.log("getList: These are the completed results "+str);
    response.end(str);
  });//End of .each()
}//End of getList

function SubmitPosList(){
  db.run("INSERT INTO Fridge (Name) SELECT Name FROM PosList", function(err){
    if(err){console.log("SubmitPosList: There was an error inserting the PosList data into the Fridge"+ err);}
  });
}

//                         END GROCCERY(POSS) LIST ITEMS                  //

//                          REGULAR ITEMS LIST                  //
//Insert Item
function regItemInput(request){
  getData(request,"",insertItem);
}

    //Used to insert new detailed item data about regular items
    function insertItem(insertVal){

      //Populate the Item's table with the Name
      db.run("INSERT INTO Item VALUES (NULL,?)", insertVal[0],function(err){

         //Handle Err if Statement fails
         if(err){console.log("regItemInput: Item insert failed "+err);}

        else{

            //Populate the Price Table with item Name and it's Price
            db.run("INSERT INTO Price VALUES(?,?)",insertVal[0],insertVal[1], function(){
              if(err){console.log("regItemInput: Price insert failed"+err);}
            });
            //Populate the Type Table with name and category
            db.run("INSERT INTO Type VALUES(?,?)",insertVal[0],insertVal[2], function(){
              if(err){console.log("regItemInput: Category insert failed"+ err);}
            });
            console.log("regItemInput: These values have been inserted: " + insertVal);
            }
      });
    }

    function rtnValues(response, type){
      var cnt =0;
      var str ="[";

        db.each(type,
        //Individual Row Callback
        function(err,results){
          if(err){console.log("rtnValues: there was an error retreiving values: "+err);}
          else if(results.Item !== null && results.Price !== null && results.Category !== null){
           //To add front comma to make valid JSON
           if(cnt>0)str+=",";
           cnt++;
           str += '{ "Name" : "'+results.Name+'",';
           str += ' "Price" : "'+results.Price+'",';
           str += ' "Category" : "'+results.Category + '",';
           str += ' "Quantity" : "'+results.Quantity + '"}';
          }
        },
        //Completion Callback
        function(){
          str += "]";
          console.log("rtnValues: These are the completed results: "+str);
          response.writeHead(200,{'Content-Type':'application/json'});
          response.end(str);
        }
      );
    }

//                  END REGULAR LIST ITEMS                      //


//Create data and User tables if not already created
function inputDatacallback(){
    db.run("CREATE TABLE if not exists Item (ID INTEGER NOT NULL PRIMARY KEY, Name TEXT  NOT NULL)");
    db.run("CREATE TABLE if not exists Type (Name TEXT NOT NULL, Category TEXT)");
    db.run("CREATE TABLE if not exists Price (Name TEXT NOT NULL, Price NUMERIC)");
    db.run("CREATE TABLE if not exists Quantity (Name TEXT NOT NULL, Quantity NUMERIC)");
    db.run("CREATE TABLE if not exists PosList (LID INTEGER NOT NULL PRIMARY KEY, Name TEXT  NOT NULL)");
    db.run("CREATE TABLE if not exists Fridge (FID INTEGER NOT NULL PRIMARY KEY, Name TEXT  NOT NULL)");
    console.log("inputDataCallback: Table's created");
}

//                       CLEAR TABLE                             //
function clearTable(tables){
      console.log("clearTable: About to clear Table\n");
      clrTable(tables,inputDatacallback);
}

function clrTable(tables,callback){

  for(var i=0;i<tables.length;i++){
    dropTbl(tables[i]);
  }
  callback();
}

function dropTbl(table){
  db.run("DROP table if exists '"+ table+ "'");
  console.log("dropTbl: "+table + "Table Cleared");
}

module.exports.clearTable = clearTable;
module.exports.inputData = inputData;
module.exports.rtnValues = rtnValues;
module.exports.insertItem = insertItem;
module.exports.upList = upList;
module.exports.getList = getList;
module.exports.regItemInput = regItemInput;
module.exports.SubmitPosList = SubmitPosList;



//module.exports.printTerminal = printTerminal;
// function printTerminal(){
//   db.each("SELECT rowid as id, Item FROM Stuff", function(err, heyyah) {
//   console.log(heyyah.id + ": " + heyyah.thing);});
// }


// db.serialize(function() {
//   console.log("inside print function printing");
//
//   if(exists){
//
//       //Create a table and insert a single value
//       db.run("CREATE TABLE STUFF (thing TEXT)");
//        //var testme = db.prepare("INSERT INTO Stuff VALUES (?)");
//        //testme.run("Thing #" + rnd);
//
//         db.run("INSERT INTO Stuff VALUES (9)");
//
//         print();
//
//   console.log("print function: exists true");
//     // response.end("Print function: exists true");
//   }
//   else{
//     console.log("print function: exists not true");
//   // response.writeHead(200, commonHeaders);
//   // response.end("Print function: exists not true");
//   }
// });









//kbou
