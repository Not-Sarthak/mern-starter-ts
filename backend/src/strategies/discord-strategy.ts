import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../schemas/user.js";

passport.serializeUser((user, done) => {
    //@ts-ignore
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const findUser = await DiscordUser.findById(id);
		return findUser ? done(null, findUser) : done(null, null);
	} catch (err) {
		done(err, null);
	}
});

export default passport.use(
	new Strategy(
		{
			clientID: "1185785809043996732",
			clientSecret: "Client Secret Goes Here",
			callbackURL: "http://localhost:3000/api/auth/discord/redirect",
			scope: ["identify"],
		},
		async (accessToken, refreshToken, profile, done) => {
			let findUser;
			try {
				findUser = await DiscordUser.findOne({ discordId: profile.id });
			} catch (err) {
				return done(err, false);
			}
			try {
				if (!findUser) {
					const newUser = new DiscordUser({
						username: profile.username,
						discordId: profile.id,
					});
					const newSavedUser = await newUser.save();
					return done(null, newSavedUser);
				}
				return done(null, findUser);
			} catch (err) {
				return done(err, false);
			}
		}
	)
);