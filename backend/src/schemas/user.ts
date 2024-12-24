import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  displayName: mongoose.Schema.Types.String,
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

// Discord User Schema
const DiscordUserSchema = new mongoose.Schema({
	username: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
	},
	discordId: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
	},
});

// User Model
export const User = mongoose.model("User", userSchema);

// DiscordUser Model
export const DiscordUser = mongoose.model("DiscordUser", DiscordUserSchema);
