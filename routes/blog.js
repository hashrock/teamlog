var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var _ = require('underscore');
var marked = require('marked');
var dotenv = require('dotenv');
dotenv.load();

marked.setOptions({
	ghm: true,
	breaks: true,
	highlight: function (code) {
		return require('highlight.js').highlightAuto(code).value;
	},
	langPrefix: "hljs-"
});

mongoose.connect(process.env.MONGODB_URL + "/teamlog");

var teamlogSchema = mongoose.Schema({
	user: String,
	title: String,
	content: String,
	room: String,
	sasuga: Number,
	rendered: String,
	deleted: Date,
	updated: {
		type: Date,
		default: Date.now
	}
});
var Blog = mongoose.model('teamlog', teamlogSchema);
var BlogBackup = mongoose.model('teamlogBackup', teamlogSchema);

module.exports = {
	index: function (req, res) {
		var cond = {
			deleted: {
				$exists: false
			}
		};
		return Blog.find(cond).sort({
			updated: -1
		}).exec(function (err, docs) {
			var items = _.map(
				docs, function (item) {
					item.rendered = marked(item.content);
					return item;
				}
			);
			res.json(items);
		});
	},
	sasuga: function (req, res) {
		return Blog.findOne({
			_id: new ObjectId(req.params.id)
		}, function (err, post) {
			if (err) {
				console.log(err);
			}
			var sasuga = post.sasuga;
			post.sasuga = sasuga + 1;
			post.save(function (err) {
				if (err) {
					console.log(err);
				}
				res.json([true, ""]);
			});
		});
		res.send("update: called as PUT method");
	},
	new: function (req, res) {
		res.send("new: called as GET method");
	},
	create: function (req, res) {
		var data = req.body;
		var instance = new Blog();
		instance.user = data.name;
		instance.title = data.title;
		instance.content = data.content;
		instance.room = "teamlog";
		instance.sasuga = 0;
		instance.save(function (err) {
			if (err) {
				res.json([false, err]);
			} else {
				res.json([true, ""]);
			}
		});
	},
	show: function (req, res) {
		res.send("show: called as GET method");
	},
	edit: function (req, res) {
		res.send("edit: called as GET method");
	},
	update: function (req, res) {
		var data = req.body;
		return Blog.findOne({
			_id: new ObjectId(req.params.blog)
		}, function (err, old) {
			old._id = mongoose.Types.ObjectId();
			old.deleted = new Date();
			return Blog.create(old, function (err) {
				return Blog.findOneAndUpdate({
						_id: new ObjectId(req.params.blog)
					}, {
						$set: {
							name: data.user,
							title: data.title,
							content: data.content
						}
					},
					function (err) {
						if (err) {
							console.log(err);
						}
						res.json([true, ""]);
					});
			});
		});

		res.send("update: called as PUT method");
	},
	destroy: function (req, res) {
		return Blog.findOneAndUpdate({
				_id: new ObjectId(req.params.blog)
			}, {
				$set: {
					deleted: new Date()
				}
			},
			function (err) {
				if (err) {
					console.log(err);
				}
				res.json([true, ""]);
			});
	}
};
