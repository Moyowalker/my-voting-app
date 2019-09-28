const mongoose = require('mongoose');
const express = require("express");
var cors = require("cors");
const bodyParser = require('body-parser');
const logger = require("morgan");
const Data = require("./data");

// const connectDB = require('./config/db');

const API_PORT = 4200;
const app = express();
app.use(cors());
const router = express.Router();

//Mongo database variable
// connectDB();

const dbRoute = "mongodb+srv://votingDB:moyosore@votingcluster0-gvuey.mongodb.net/test?retryWrites=true&w=majority"

//Mongo database connection to our backend code
mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

db.once('open', () => console.log('It has been connected to the database'));

//to check mongo db connection is successful
db.on("error", console.error.bind(console, 'MongoDB Connection error:'));

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://votingDB:<password>@votingcluster0-gvuey.mongodb.net/test?retryWrites=true&w=majority"
// const client = new MongoClient(uri, {useNewUrlParser: true});
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     client.close();
// });

//This is (Optional) only made for logging and bodyParser, parses the request body to be a readable JSON format
// But I need this so i will invoke it 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));


//TO fetch all available data in my votingCluster0 DB
router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json(
            { success: false, 
              error: err });
        return res.json({
            success: true,
            data: data
        });
    });
});

// to update or overwrites existing data in votingCluster DB
router.post('./updateData', (req, res) => {
    const { id, update } = req.body;
    Data.findByIdAndUpdate(id, update, (err) => {
        if (err)
        return res.json({
            success: false,
            error: err
        });
        return({
            success: true,
            data: data
        });
    });
});


// to create a data
router.post('./putData', (req, res) => {
    let data = new Data();

    const { id, message } = req.body;

    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS My OG>>>>>.',
        });
    }
    data.message = message;
    data.id =id;
    data.save((err) => {
        if (err) 
        return res.json({
            success: false,
            error: err
        });
        return res.json({
            success: true
        });
    });
});


//to append the /api route for our http requests
app.use('/api', router);

//launch our backend into a part
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));