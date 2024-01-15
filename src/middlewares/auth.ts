import { passport } from "../plugins/passport";

const authLocalMiddleware = passport.authenticate("local", { session: false });

const authMiddleware = passport.authenticate("jwt", { session: false });

export { authMiddleware, authLocalMiddleware };
