const path = require('path');
const express = require('express');
const favicon = require('express-favicon');

const { IpFilter, IpDeniedError } = require('express-ipfilter');

const port = process.env.PORT || 8080;
const allowedIPs = [process.env.IP_THAT_CAN_SEE_SOURCE_MAPS];

const app = express();

app.get(/\.map$/, IpFilter(allowedIPs, {mode: 'allow'}));

app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

app.use((err, req, res, next) => {
    if (err instanceof IpDeniedError) {
        res.sendStatus(401);
    } else{
        res.sendStatus(err.status || 500);
    }
});

app.listen(port);