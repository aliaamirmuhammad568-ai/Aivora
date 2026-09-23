import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { findById, upsertOAuthUser } from './userStore.js'

const API_URL = process.env.API_URL || 'http://localhost:3001'

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    done(null, await findById(id))
  } catch (err) {
    done(err)
  }
})

export const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
export const githubEnabled = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)

if (googleEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${API_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          done(null, await upsertOAuthUser(profile, 'google'))
        } catch (err) {
          done(err)
        }
      },
    ),
  )
}

if (githubEnabled) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${API_URL}/api/auth/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          done(null, await upsertOAuthUser(profile, 'github'))
        } catch (err) {
          done(err)
        }
      },
    ),
  )
}

export default passport
