require("dotenv").config()

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose")
const cors = require("cors")
const session = require("express-session")
const passport = require("passport")
const initializePassport = require("./passport-config")

const app = express();

//database
mongoose.set("strictQuery", false)

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.log(error))

app.use(cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST"],
    credentials: true
}))

app.use(session({secret: "cats", resave: false, saveUnitialized: true}))
initializePassport.initialize(passport)
app.use(passport.initialize())
app.use(passport.session())

const indexRouter = require('./routes/index');

app.use(logger('dev'));
app.use(express.json({limit: '12mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(3000, () => console.log("Server Started"))