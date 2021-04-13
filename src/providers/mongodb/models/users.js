const { Schema, } = require("mongoose");

const userSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  guild_id: {
    type: String,
    required: true
  },
  xp: {
    type: Number,
    required: true
  },
  last_updated: {
    type: Number,
    required: true,
  }
});

module.exports.UserSchema = userSchema; 