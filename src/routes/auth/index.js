'use strict'
const express = require("express")
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const authController = require("../../controllers/auth.controller")
const passport = require("passport")

router.post('/register', asyncHandler(authController.register))
router.post('/login', asyncHandler(authController.login))
router.post('/forgotPassword', asyncHandler(authController.forgotPassword))

// OAuth2
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get("/google/callback", (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
        req.user = profile
        next()
    })(req, res, next)
}, (req, res) => {
    res.redirect(`${process.env.URL_CLIENT}/auth/login-success/${req.user?.id}`)
})

router.get("/google/redirect", asyncHandler(authController.getGoogleAuthURL))

router.post("/login-success/:id", authController.loginSuccess)

module.exports = router