require("dotenv").config()

var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"]

  if (!authHeader) {
    return res.status(401).json({error: "Unauthorized user"})
  }

  jwt.verify(authHeader, process.env.SECRET_KEY, (err, user) => {
    req.user = user
    next()
  })
}


router.post("/sign-up", asyncHandler(async (req, res, next) => {
  const findUser = await User.findOne({username: req.body.username})

  if (findUser) {
    return res.status(400).json({message: "User already exists"})
  }

  bcrypt.hash(req.body.password, 5, async (err, hashedPassword) => {
    if (err) throw err
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      about: req.body.about,
      avatar: req.body.avatar
    })

    await newUser.save()
    return res.status(200).json({username: newUser.username, avatar: newUser.avatar})
  })
  
}))

router.post("/log-in", asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({error: "Internal server error"})
    }
    if (!user) {
      return res.status(401).json({error: info.message})
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log(err)
      }
    const accessToken = jwt.sign({id: user.id, username: user.username}, process.env.SECRET_KEY)
    const base64Avatar = user.avatar.toString("base64")
    console.log(base64Avatar)

    return res.status(200).json({id: user.id, username: user.username, avatar: base64Avatar, accessToken})
    })
  })(req, res, next)
}))

router.get("/home", authenticateUser, asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user)
  })
)

router.post("/home/log-out", authenticateUser, asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log(err)
      return next(err)
    }
  })
  res.status(200).send("Logged Out")
}))

module.exports = router;
