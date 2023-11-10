const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dishs = require('./models/dishSchema');
const dbURI = "mongodb+srv://3bzaher:newpass00@cluster0.mun6mwu.mongodb.net/rocket?retryWrites=true&w=majority"
const fs = require('fs');

mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch(err => console.log('Error connecting', err));
app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));


var fileupload = require("express-fileupload");
app.use(fileupload());


app.get('/', function(req, res) {
    // res.send('hello world');
    dishs.find().sort({ createdAt: -1})
    .then((result) => res.render('menu', {root: __dirname, dishes: result}))
    .catch((err) => console.log(err));

});

app.get('/dish', function(req, res) {
    res.render('addDish')
});
app.post('/add-dish', (req, res) => {
    const dishData = {
        name: req.body['dish-name'],
        cat: req.body['dish-category'],
        subcat: req.body['sub-dish-category'],
        description: req.body['dish-description'],
        price: req.body['dish-price']
    };

    const file = req.files && req.files.thumbnail; // Ensure thumbnail exists in req.files
    
    if (file) {
        const targetPath = 'rocket/images/random/food/' + file.name; // Use file.name instead of req.files.thumbnail.filename

        fs.writeFile("./static/"+targetPath, file.data, (err) => {
            if (err) {
                res.send(err);
            } else {
                const dish = new dishs({
                    name: dishData.name,
                    cat: dishData.cat,
                    subcat: dishData.subcat,
                    description: dishData.description,
                    price: dishData.price,
                    thumbnail: targetPath // Assign the path to the thumbnail field
                });

                dish.save()
                    .then((result) => res.send(JSON.stringify(result)))
                    .catch((err) => console.error(err));
            }
        });
    } else {
        res.send("No file received");
    }
});
