const mongoose = require('mongoose');

const connectDB = () =>{
    //database connection
    mongoose.connect(process.env.MONGO_CONNECTIONURL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology:true
    });
    const connection = mongoose.connection;

    connection.once("open", () =>{
        console.log("Database connected");
    }).catch((err) =>{
        console.log("connection failed");
    })
}

module.exports = connectDB;