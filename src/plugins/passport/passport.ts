import { Passport } from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../../db";
import { comparePassword, createToken } from "../auth";

const setupPassport = () => {
  const passport = new Passport();
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true,
        session: false,
      },
      async (req, username, password, done) => {
        if (!username || !password) {
          return done(null, false, { message: "Invalid credentials" });
        }
        const user = await prisma.user.findFirst({
          where: {
            userName: username,
          },
        });

        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        if (!comparePassword(password, user.hash)) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, {
          token: createToken(user),
          user: {
            id: user.id,
            fullName: user.fullName,
            role: user.role,
          },
        });
      }
    )
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        const user = await prisma.user.findUnique({
          where: {
            id: payload.id,
          },
        });

        if (user) {
          return done(null, {
            user: {
              id: user.id,
              fullName: user.fullName,
              role: user.role,
            },
          });
        }
      }
    )
  );

  return passport;
};

const passport = setupPassport();

export { passport };
