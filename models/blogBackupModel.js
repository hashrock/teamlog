var mongoose = require('mongoose');

var teamlogSchema = mongoose.Schema({
	user: String,
	title: String,
	content: String,
	room: String,
	sasuga: Number,
	rendered: String,
	tag: [String],
	deleted: Date,
	updated: {
		type: Date,
		default: Date.now
	}
});
module.exports = mongoose.model('teamlogBackup', teamlogSchema);
