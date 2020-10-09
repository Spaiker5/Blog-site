//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


require('dotenv').config();

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

mongoose.connect("mongodb://localhost:27017/tech-blogDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const postSchema = {
	title: String,
	content: String,
	category: String
};

const Post = mongoose.model("Post", postSchema);


////APP//////////////////////////////////////////////////////////////////////////////////////

app.get("/", function(req, res) {
	Post.find({}, function(err, posts) {
		res.render("index", {
			posts: posts
		});
	});
});
app.get("/komp", function(req, res) {
	Post.find({
			category: "Komputery"
		}, function(err, posts) {
			res.render("index", {
				posts: posts
			});
		}

	);

});

// Compose \\\\\\\\\\\\\\\\\\\\\//////////////////////////////////////

app.get("/compose", function(req, res) {
	res.render("compose");
});

app.post("/compose", function(req, res) {
	const post = new Post({
		title: req.body.postTitle,
		content: req.body.postBody,
		category: req.body.postCategory
	});


	post.save(function(err) {
		if (!err) {
			res.redirect("/");
		}
	});
});

app.get("/posts/:postId", function(req, res) {

	const requestedPostId = req.params.postId;

	Post.findOne({
		_id: requestedPostId
	}, function(err, post) {
		res.render("post", {
			title: post.title,
			content: post.content
		});
		console.log(post.title);
	});
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Our app is running on port ${ PORT }`);
});
