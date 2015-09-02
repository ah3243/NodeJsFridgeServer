

var https = require('https'),      // module for https
    fs =    require('fs');         // required to read certs and keys

var options = {
    key:    fs.readFileSync('ssl/server.key'),
    cert:   fs.readFileSync('ssl/server.crt'),
    ca:     fs.readFileSync('ssl/ca.crt'),
    requestCert:        true,
    rejectUnauthorized: false
};

https.createServer(options, function (req, res) {
    if (req.client.authorized) {
        res.writeHead(200, {&quot;Content-Type&quot;: &quot;application/json&quot;});
        res.end('{&quot;status&quot;:&quot;approved&quot;}');
    } else {
        res.writeHead(401, {&quot;Content-Type&quot;: &quot;application/json&quot;});
        res.end('{&quot;status&quot;:&quot;denied&quot;}');
    }
}).listen(443);
