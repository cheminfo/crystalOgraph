var fs = require('fs'),
    xml2js = require('xml2js'),
    Promise = require('bluebird');

var parser = new xml2js.Parser();
var prom = [];
for(var i=1; i<=230; i++) {
    prom.push(parseITAfile(__dirname + '/data/itc' + formatNumberLength(i, 3) + (i>74 ? '' : 'n') + '.xml'));
}


Promise.all(prom).then(function(r) {
    console.log('Done all');
    console.log(JSON.stringify(r[0]));
    fs.writeFile(__dirname + '/data/all.json', JSON.stringify(r), function(err) {
        if(!err) {
            console.log('Success');
        }
    });
}).catch(function(err) {
    console.log('Error', err);
});

function parseITAfile(filepath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filepath, function(err, data) {
            if(err) {
                return reject(err);
            }
            parser.parseString(data, function (err, result) {
                console.log('Done ' + filepath);
                return resolve(result)
            });
        });
    });
}

function formatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}