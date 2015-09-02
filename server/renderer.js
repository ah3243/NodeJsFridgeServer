//Renderer

var fs = require("fs");

function view(templateName, values, response){
    //Read from the template file
      var fileContents = fs.readFileSync('../views/' + templateName + ".html");
        //insert values into content

        //write out to the response
        response.write(fileContents);

}

module.exports.view = view;
