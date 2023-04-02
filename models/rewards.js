const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
	guildID: { type: String },
	rewards: { type: Array, default: [], required: true },
	lastUpdated: { type: Date, default: new Date() },
});

module.exports = mongoose.model('Rewards', RewardSchema);
