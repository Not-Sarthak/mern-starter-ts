import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../schemas/user.js";
import { comparePassword } from "../utils/helpers.js";

passport.serializeUser((user, done) => {
	//@ts-ignore
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const findUser = await User.findById(id);
		if (!findUser) throw new Error("User Not Found");
		done(null, findUser);
	} catch (err) {
		done(err, null);
	}
});

export default passport.use(
	new Strategy(async (username, password, done) => {
		try {
			const findUser = await User.findOne({ username });
			if (!findUser) throw new Error("User not found");
			if (!comparePassword(password, findUser.password))
				throw new Error("Bad Credentials");
			done(null, findUser);
		} catch (err) {
			//@ts-ignore
			done(err, null);
		}
	})
);