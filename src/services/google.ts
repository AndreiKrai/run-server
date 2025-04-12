// @ts-nocheck
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import prisma from "../services/prisma";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const setupPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "/auth/google/callback",
        proxy: true,
      },
      async (
        accessToken,
        refreshToken,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          // Extract data from Google profile
          const { id: googleId, emails, displayName, name, photos } = profile;

          if (!emails || emails.length === 0) {
            return done(new Error("No email found in Google profile"));
          }

          const email = emails[0].value;
          const picture = photos && photos.length > 0 ? photos[0].value : null;
          const firstName = name?.givenName || "";
          const lastName = name?.familyName || "";

          // Check if user exists by googleId first (most reliable)
          let user = await prisma.user.findFirst({
            where: {
              OR: [
                { googleId },
                { email }, // Fallback to email
              ],
            },
            include: { profile: true },
          });

          // Store OAuth tokens regardless of new or existing user
          const tokenData = {
            accessToken,
            refreshToken,
            expiresAt: refreshToken ? new Date(Date.now() + 3600000) : null, // 1 hour expiry
            provider: "google",
            scope: "profile email",
          };

          if (user) {
            // Update existing user with Google ID if they don't have it yet
            if (!user.googleId) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: {
                  googleId,
                  provider: user.provider || "google", // Keep original provider if exists
                  lastLogin: new Date(),
                  emailVerified: true, // Mark email as verified if using Google
                },
                include: { profile: true },
              });
            } else {
              // Just update last login time
              await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
              });
            }

            // Update token for this user and provider
            await prisma.token.upsert({
              where: {
                userId_kind_provider: {
                  userId: user.id,
                  kind: "oauth",
                  provider: "google",
                },
              },
              update: tokenData,
              create: {
                userId: user.id,
                kind: "oauth",
                ...tokenData,
              },
            });

            // Update profile if needed
            if (user.profile) {
              await prisma.profile.update({
                where: { userId: user.id },
                data: {
                  // Only update fields that aren't already set
                  picture: user.profile.picture || picture,
                  firstName: user.profile.firstName || firstName,
                  lastName: user.profile.lastName || lastName,
                  displayName: user.profile.displayName || displayName,
                },
              });
            }
          } else {
            // Create new user with Google data
            const randomPassword = uuidv4();
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await prisma.user.create({
              data: {
                email,
                googleId,
                provider: "google",
                password: hashedPassword,
                emailVerified: true,
                lastLogin: new Date(),
                profile: {
                  create: {
                    firstName,
                    lastName,
                    displayName,
                    picture,
                  },
                },
                tokens: {
                  create: {
                    kind: "oauth",
                    ...tokenData,
                  },
                },
              },
              include: {
                profile: true,
              },
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  return passport;
};

export default setupPassport;
