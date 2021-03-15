require('dotenv').config();
const express = require("express");
const app = express();
const connectDB = require('./config/db')
const path = require('path')

const PORT = process.env.PORT || 3000;
connectDB();

//telmplate engines

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'/views'))
app.use(express.json())
app.use(express.static('public'))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000/");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'))
app.listen(PORT, () =>{
    console.log(`Linsening server on port ${PORT}`);
})