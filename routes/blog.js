var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var _ = require('underscore');
var marked = require('marked');
var dotenv = require('dotenv');
dotenv.load();

var Blog = require('../models/blogModel');
var BlogBackup = require('../models/blogBackupModel');

marked.setOptions({
	ghm: true,
	breaks: true,
	highlight: function (code) {
		return require('highlight.js').highlightAuto(code).value;
	},
	langPrefix: "hljs-"
});

var mongo_url = process.env.MONGODB_URL ? process.env.MONGODB_URL : "mongodb://localhost:27017";
mongoose.connect(mongo_url + "/teamlog");

function splitTag(tagStr){
    if(tagStr === undefined || tagStr.length === 0){
        return [];
    }
    if (tagStr instanceof Array){
      return tagStr;
    }

    var result = tagStr.split(",").map(function (item) {
		return item.trim();
	}).filter(function (item) {
		return item.length > 0;
	});
    return result;
}


module.exports = {
	index: function (req, res) {
		var cond;
		if (req.query && req.query.tag) {
			cond = {
				tag: req.query.tag,
				deleted: {
					$exists: false
				}
			};
		} else {
			cond = {
				deleted: {
					$exists: false
				}
			};
		}

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
		instance.tag = splitTag(data.tag);
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
			var backup = new BlogBackup();
			backup.user = old.user;
			backup.title = old.title;
			backup.content = old.content;
			backup.room = old.room;
			backup.sasuga = old.sasuga;
			backup.deleted = new Date();
			backup.save(function (err) {
				if (err) {
					res.json([false, err]);
				}
				Blog.findOneAndUpdate({
						_id: new ObjectId(req.params.blog)
					}, {
						$set: {
							name: data.user,
							title: data.title,
							content: data.content,
							tag: splitTag(data.tag)
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
		Blog.findById(new ObjectId(req.params.blog), function (err, item) {
			var backup = new BlogBackup();
			backup.user = item.user;
			backup.title = item.title;
			backup.content = item.content;
			backup.room = item.room;
			backup.sasuga = item.sasuga;
			backup.deleted = new Date();
			backup.save(function (err) {
				if (err) {
					res.json([false, err]);
				}
				item.remove(function (err) {
					if (err) {
						res.json([false, err]);
					}
					res.json([true, ""]);
				});
			});
		});
	}
};
