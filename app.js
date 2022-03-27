const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();
const homeStartingContent =
  "HOME HOME Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "ABOUT ABOUT Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "CONTACT CONTACT Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
let posts = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("DB connected");
  }
);

const schema = {
  title: String,
  body: String,
};

const Blog = mongoose.model("Blog", schema);

app.get("/", (req, res) => {
  Blog.find({}, (err, posts) => {
    if (!err) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts,
      });
      // console.log(posts);
    }
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactPageContent: contactContent,
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutPageContent: aboutContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Blog({
    title: req.body.postTitle,
    body: req.body.postBody,
  });
  post.save((err) => {
    if (!err) {
      console.log("Successfully added a new Blog post !");
      res.redirect("/");
    } else {
      res.send(err);
    }
  });
});

app.get("/posts/:title", function (req, res) {
  var requestedTitle = _.lowerCase(req.params.title);
  Blog.findOne({ title: req.params.title }, function (err, result) {
    if (result) {
      res.render("post", { postTitle: result.title, postBody: result.body });
    } else if (!result) {
      res.send("404");
    }
  });
});

app.post("/update", function (req, res) {
  res.render("update", {
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
  });
});

app.post("/updateJournal", function (req, res) {
  Blog.updateOne(
    { title: req.body.postTitle },
    { $set: { title: req.body.newPostTitle, body: req.body.newPostBody } },
    function (err) {
      if (!err) {
        console.log("successfilly updated the journal");
        res.redirect("/");
      } else {
        res.send("error updating:" + err);
      }
    }
  );
});

app.post("/delete", function (req, res) {
  Blog.deleteOne({ title: req.body.postTitle }, (err) => {
    if (!err) {
      console.log("successfilly deleted a post : " + req.body.postTitle);
      res.redirect("/");
    } else {
      res.send("error deleting:" + err);
    }
  });
});

app.listen(process.env.PORT, function () {
  console.log(`Server started on localhost port ${process.env.PORT}`);
});
