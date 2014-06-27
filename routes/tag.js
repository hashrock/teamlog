var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Blog = require('../models/blogModel');
var BlogBackup = require('../models/blogBackupModel');
var _ = require('underscore');

module.exports = {
	//タグ一覧
	index: function (req, res) {
		Blog.find({}, function (err, items) {
			if(!items || items.length === 0){
				res.json({
					"tags": []
				});
				return;
			}
			var alltag = items.map(function (item) {
				return item.tag;
			}).reduce(function (a, b) {
				return a.concat(b);
			});
			var tags = _.uniq(alltag);
			res.json({
				"tags": tags
			});
		});
	}
};
