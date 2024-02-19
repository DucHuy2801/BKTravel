const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy
const OAuth2Account = require("../models/oauth2_account.model")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/api/v1/auth/google/callback`,
    passReqToCallback: true
},

    async function(request, access_token, refresh_token, profile, done) {
        if (profile?.id) {
            const response = new OAuth2Account({
                account_id: profile.id,
                email: profile.email,
                provider: profile.provider,
                fullname: profile.displayName,
                avatar: profile.picture
            })

            console.log(`new account`, response)
            await response.save()
        }

        return done(null, profile)
    }
))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})