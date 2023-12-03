const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dishs = require('./models/dishSchema');
const fs = require('fs');
const dbURI = "mongodb+srv://3bzaher:newpass00@cluster0.mun6mwu.mongodb.net/rocket?retryWrites=true&w=majority"
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch(err => console.log('Error connecting', err));
app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/static'));
app.use(express.json());

var easyinvoice = require('easyinvoice');


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



app.get('/kickoff', (req, res) => {
   res.render('rocket/kickoff') 
});


app.get('/menu', (req, res) => {
    dishs.find().sort({ createdAt: -1})
    .then((result) => res.render('rocket/menu', {root: __dirname, dishes: result}))
    .catch((err) => console.log(err));
});


app.post('/receive_order', (req, res) => {
    const receivedOrderData = req.body.orderData;
  
    console.log('Received order:', receivedOrderData);

    var data = {
        "customize": {
            //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
        },
        "images": {
            // The logo on top of your invoice
            "logo": "static/rocket/images/logos/Rocket.jpg",
        },
        "sender": {
            "company": "Rocket Cafe",
            "address": "El Ma3had El Deeny",
            "city": "Asyut",
            "country": "Egypt"
        },
        "information": {
            // Invoice number
            "number": "2021.0001",
            // Invoice data
            "date": "12-12-2021",
            // Invoice due date
            "due-date": "31-12-2021"
        },
        // The products you would like to see on your invoice
        // Total values are being calculated automatically
        "products": null,
        // The message you would like to display on the bottom of your invoice
        "bottom-notice": "Kindly pay your invoice within 15 days.",
        // Settings to customize your invoice
        "settings": {
            "currency": "EGP", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
            // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')        
            // "margin-top": 25, // Defaults to '25'
            // "margin-right": 25, // Defaults to '25'
            // "margin-left": 25, // Defaults to '25'
            // "margin-bottom": 25, // Defaults to '25'
            // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
            // "height": "1000px", // allowed units: mm, cm, in, px
            // "width": "500px", // allowed units: mm, cm, in, px
            // "orientation": "landscape", // portrait or landscape, defaults to portrait
        },
        // Translate your invoice to your preferred language
        "translate": {
            // "invoice": "FACTUUR",  // Default to 'INVOICE'
            // "number": "Nummer", // Defaults to 'Number'
            // "date": "Datum", // Default to 'Date'
            // "due-date": "Verloopdatum", // Defaults to 'Due Date'
            // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
            // "products": "Producten", // Defaults to 'Products'
            // "quantity": "Aantal", // Default to 'Quantity'
            // "price": "Prijs", // Defaults to 'Price'
            // "product-total": "Totaal", // Defaults to 'Total'
            // "total": "Totaal", // Defaults to 'Total'
            // "vat": "btw" // Defaults to 'vat'
        },
    };
    easyinvoice.createInvoice(data, function (result) {
        // The response will contain a base64 encoded PDF file
        const pdfBase64 = result.pdf;

        // Send the PDF back to the client or save it as needed
        res.json({ message: 'Order received and being processed! 🚀', pdf: pdfBase64 });
    });
  });
  


