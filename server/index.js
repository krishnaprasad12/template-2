const express = require('express')
const app = express()
const port = 3000
const connect=require('./config/db')
const dotenv=require('dotenv')
const cors=require('cors')
const path = require('path');
const dataRoute = require('./routes/contactUs')
const adminRoute = require('./routes/admin')
const valueRoute = require('./routes/value')
const heroRoute = require('./routes/hero')
// const productRoute = require('./routes/product')


dotenv.config(); // read the .env file
connect() // connect to MongoDB

app.use(cors()); // allow requests from any origin
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true }))  // parse URL-encoded bodies

// Serve static files 
//By using express.static, you can make the files in the uploads folder publicly accessible via URLs.
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));  // http://localhost:3000/uploads/imagename.jpg
app.use('/api', dataRoute); // use the router
app.use('/api', adminRoute); // use the admin router
app.use('/api', valueRoute); // use the value router
app.use('/api',heroRoute); // use the hero router
// app.use('/api',productRoute); // use the product router

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
