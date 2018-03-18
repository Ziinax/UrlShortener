var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var base58 = require('./encoder58.js');
var open = require ('open');


// grab the url model
var Url = require('./models/url');

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'public/views/index.htm'));

});


app.get('/api/all', function(req, res){

    Url.find({},{}, function(err, result) {
        if (err) throw err;
        datas = JSON.stringify(result)
        data = JSON.parse(datas); 
        for(var i = 0; i < data.length; i++) {

            data[i]._id = config.webhost + base58.encode(data[i]._id);  

        }

        res.send(data);
    });

});



app.post('/api/shorten', function(req, res){
    var longUrl = req.body.url;
    var shortUrl = '';

    // check if url already exists in database
    Url.findOne({long_url: longUrl}, function (err, doc){
        if (doc){
            shortUrl = config.webhost + base58.encode(doc._id);

            // the document exists, return it without creating a new entry
            res.send({'shortUrl': shortUrl,
                      'longUrl' : doc.long_url,
                      'date'     : doc.created_at,
                      'clicked' : doc.clicked
                     });
        } else {
            // since it doesn't exist, so create it:
            var newUrl = Url({
                long_url: longUrl,
                clicked : 0
            });

            // save the new link
            newUrl.save(function(err) {
                if (err){
                    console.log(err);
                }

                shortUrl = config.webhost + base58.encode(newUrl._id);

                res.send({'shortUrl': shortUrl,
                          'longUrl' : longUrl,
                          'date'     : new Date,
                          'clicked' : 0
                         });
            });
        }

    });

});

app.get('/:encoded_id', function(req, res){
    var base58Id = req.params.encoded_id;
    var id = base58.decode(base58Id);
    // check if url already exists in database
    Url.findOne({_id: id}, function (err, doc){
        if (doc) {
            res.redirect(doc.long_url);

        } else { 
            res.redirect(config.webhost);

        }
    });

});

app.post('/api/click', function(req, res){

    var longUrl = req.body.url;


    var shortUrl = '';
    // check if url already exists in database
    Url.findOne({long_url: longUrl}, function (err, doc){
        if (doc){

            Url.update({ long_url: longUrl }, { $set: { "clicked": doc.clicked + 1 }}, function(err, res){
                if (res){

                    console.log(res);
                } else {

                    console.log(err);
                }
            });

            res.send({'click': doc.clicked + 1,
                      'longUrl' : doc.long_url,
                      'date'     : doc.created_at
                     });
        } else {
            console.log(err);
        }
    });

});


var server = app.listen(3000, function(){
    console.log('Server listening on port 3000');
});

