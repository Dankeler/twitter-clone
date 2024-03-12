require("dotenv").config()

var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const jwt = require("jsonwebtoken")

const User = require("../models/user")
const Post = require("../models/post")
const Comment = require("../models/comment")

function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader.split(" ")[1]

  if (!authHeader) {
    return res.status(401).json({error: "Unauthorized user"})
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
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
    
    let avatarToSend = user.avatar
    console.log(user.avatar)
    if (user.avatar === null) {
      avatarToSend = null
    } else {
      avatarToSend = user.avatar.toString("base64")
    }

    return res.status(200).json({id: user.id, username: user.username, avatar: avatarToSend, accessToken})
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

// MAINFEED GET POSTS
router.get("/posts", authenticateUser, asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate("author", ["username", "avatar"]).populate("comments").sort({datecreated: -1})
  res.status(200).json(posts)
}))

router.post("/post/create", authenticateUser, asyncHandler(async (req, res, next) => {
  const post = new Post({
    author: req.user.id,
    content: req.body.postText
  })

  await post.save()
  res.status(200).json(post)
}))

router.post("/post/comment/create", authenticateUser, asyncHandler(async (req, res, next) => {
  const comment = new Comment({
    author: req.user.id,
    content: req.body.replayContent,
  })
  await comment.save()
  const post = await Post.findById(req.body.id)
  post.comments.push(comment)
  await post.save()
  res.status(200).send("good")
}))

module.exports = router;
