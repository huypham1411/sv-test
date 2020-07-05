const express = require('express');
const app = express();
const port = process.env.PORT || 3030;
const cors = require('cors');
const bodyParser = require('body-parser')
const authRoute = require('./routers/auth');
const productRoute = require('./routers/listproduct');
const forgetPass = require('./routers/forgetPass');
const mongoose = require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
app.use(express.static('build'));
const path = require('path')
//check limit payload
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// Serve static files from the React frontend app
//quan trong de deploy
app.get('/api', (req, res) => {
    res.status(200).json({api: 'version 1'})
  })
app.use(express.static(path.join(__dirname, 'client/build')))
// Anything that doesn't match the above, send back index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/build/index.html'))
// })
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers","auth-token");
    next();
});
//CONNECT TO DATABASE
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false  }, ()=>{console.log('Connect to DB!')});
app.use(bodyParser())
app.use(bodyParser.json())
app.use('/',authRoute);
app.use('/products',productRoute);//localhost:3030/products
app.use('/forgetpassword',forgetPass);
app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
