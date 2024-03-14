require("dotenv").config()

var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId

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
  const posts = await Post.find().populate("author", ["username", "avatar"]).populate({
    path: 'comments',
    populate: { path: 'author', select: 'username avatar' }
  }).sort({datecreated: -1})
  
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

router.patch("/post/like", authenticateUser, asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.body.id);

  if (post.likes.includes(req.user.id)) {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.id,
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    res.status(201).send(updatedPost);
  } else {
    const updatedPost = await Post.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.status(200).send(updatedPost);
  }
}));

router.patch("/post/comment/like", authenticateUser, asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.body.id);

  if (comment.likes.includes(req.user.id)) {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.body.id,
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    res.status(201).send(updatedComment);
  } else {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.status(200).send(updatedComment);
  }
}));

router.get("/home/users", authenticateUser, asyncHandler(async (req, res, next) => {
  const users = await User.find({}, {username: 1, about: 1, avatar: 1, friends: 1})
  const filteredUsers = users.filter(user => user.id !== req.user.id)
  res.status(200).json(filteredUsers)
}))

router.patch("/home/users", authenticateUser, asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.body.id);
  const requestingUserId = new mongoose.Types.ObjectId(req.user.id); // Convert user ID to ObjectId

  if (!user) {
    return res.status(404).send("User not found");
  }

  const isAlreadyFriend = user.friends.some(friend => friend.friendId.toString() === requestingUserId.toString() && friend.status === "friends");
  const becomeFriends = user.friends.find(friend => friend.friendId.toString() === requestingUserId.toString() && friend.status === "added_by");
  const isRequestedByUser = user.friends.some(friend => friend.friendId.toString() === requestingUserId.toString() && friend.status === "received_from");

  if (isAlreadyFriend) {
    return res.status(400).send("Already friends");
  }

  if (isRequestedByUser) {
    return res.status(400).send("Friend request already sent or received");
  }

  if (becomeFriends) {
    await User.findOneAndUpdate(
      { _id: req.body.id, "friends.friendId": requestingUserId },
      { $set: { "friends.$.status": "friends" } }
    );
  
    await User.findOneAndUpdate(
      { _id: req.user.id, "friends.friendId": user._id },
      { $set: { "friends.$.status": "friends" } }
    );
    return res.status(201).send("request accepted")
  }

  const friendRequest = {
    friendId: requestingUserId,
    status: "received_from"
  };

  await User.findByIdAndUpdate(
    req.body.id,
    { $addToSet: { friends: friendRequest } }
  );

  await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { friends: { friendId: user._id, status: "added_by" } } }
  );

  return res.status(200).send("Friend request sent");
}));

router.get("/home/users/:userId", authenticateUser, asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId, {username: 1, about: 1, avatar: 1, friends: 1, posts: 1})
  const posts = await Post.find({author: req.params.userId}, {content: 1, comments: 1, likes: 1, datecreated: 1}).sort({datecreated: -1})
  const isFriend = user.friends.find(friend => friend.status === "friends")
  res.status(200).json({user, posts, isFriend})
}))



module.exports = router;
