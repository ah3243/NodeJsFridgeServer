/*jshint multistr: true*/
/*jshint -W043 */
function printindexBody(items){
var indexBodyView='\
<section class="loginform">\
<form name="item_input" action="http://127.0.0.1:8080/" method="POST" accept-charset="utf-8">\
    <ul>\
        <li><label for="item1">First Item</label>\
        <input type="text" name="item1" placeholder="Enter name" required></li>\
        <li><label for="item2">Second Item</label>\
        <input type="text" name="item2" placeholder="Enter name"></li>\
        <input type="submit" value="send">\
    </ul>\
</form>\
</section>\
<section class="inputForm">\
<form name="input_form" action="http://127.0.0.1:8080/input" method="POST" accept-charset="utf-8">\
    <ul>\
        <li><label for="inputItem">Please enter a string value</label>\
        <input type="text" name="inputItemName" placeholder="input string" required></li>\
        <input type="submit" value="send">\
    </ul>\
</form>\
</section>\
<form class="print" method="POST" action="http://127.0.0.1:8080/print">\
  <input type="submit" value="Print All Data">\
</form>\
<select id="sel1">\
  <option value="4" id="1"></option>\
</select>\
<script type="text/javascript">\
function addNode(input){\
  var parent = document.getElementById("sel1");\
  var child = document.getElementById("1");\
  var option = document.createElement("option");\
  var node = document.createTextNode(input);\
  option.appendChild(node);\
  parent.appendChild(option,child);\
}\
\
</script>';
}
function printHeader(input){
var headerView='\
<!DOCTYPE html>\
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">\
<head>\
  <meta charset="utf-8" />\
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />\
  <!--To help adapt for mobile screens-->\
  <meta name="viewport" content="width=device-width, initial-scale=1"/>\
  <!-- Google Fonts -->\
  <link href="http://fonts.googleapis.com/css?family=Amaranth:700,400italic,400" rel="stylesheet" type="text/css" />\
  <link href="http://fonts.googleapis.com/css?family=Arimo:700italic" rel="stylesheet" type="text/css" />\
  <style>\
  section.loginform{\
    position:absolute;\
    top:45%;\
    left:40%;\
  }\
  section.inputForm{\
    position:absolute;\
    top:60%;\
    left:40%;\
  }\
  form.print{\
    position:absolute;\
    top:70%;\
    left:40%;\
  }\
    body {\
      background-color: #e3dede;\
      font-family: "Amaranth", sans-serif;\
    }\
  </style>\
</head>\
<!--                                             Body                                 -->\
<body>\
';
}

function printFooter(input){
var footerView='\
</body>\
</html>\
';}
