'use strict'

const User = require("../models/user.model")
const { BadRequestError } = require("../core/error.response")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { findUserByEmail } = require("../services/user.service")
const sendMail = require("../utils/sendMail")
const authService = require("../services/auth.service")
const querystring = require("querystring")

const createAccessToken = (user, expiresIn = '30m') => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: expiresIn
    })
}

const createRefreshToken = (user, expiresIn = '7d') => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: expiresIn
    })
}

const redirectURI = "auth/google";

class AuthController {
    register = async (req, res, next) => {
        const { firstname, lastname, email, password, confirm_password } = req.body

        const alreadyExistUser = await User.findOne({ where: {email}})
        if (alreadyExistUser) throw new BadRequestError("Email is exist!")

        if (password.length < 6) throw new BadRequestError("Password is weak!")

        if (password !== confirm_password) throw new BadRequestError("Password is not matched!")

        const hassedpassword = await bcrypt.hash(password, 10)

        const newUser = new User({firstname, lastname, email, password: hassedpassword, role_user: 'customer'})

        const savedUser = await newUser.save()
        if (savedUser) {
            return res.status(201).json({
                message: "Register successfully!"
            })
        }
    }

    login = async (req, res, next) => {
        const { email, password } = req.body;
        const foundUser = await findUserByEmail(email);
        if (!foundUser) {
            return res.status(400).json("Email doesn't exist!")
        }
        const match = bcrypt.compareSync(password, foundUser.password)
        if (!match) return res.status(400).json("Password is wrong!")

        const access_token = createAccessToken({
            user_id: foundUser.user_id,
            email: foundUser.email,
            role_user: foundUser.role_user
        })

        const refresh_token = createRefreshToken({
            user_id: foundUser.user_id,
            email: foundUser.email,
            role_user: foundUser.role_user
        })

        foundUser.access_token = access_token
        foundUser.refresh_token = refresh_token
        foundUser.save()
        
        return res.status(200).json({
            access_token: access_token,
            refresh_token: refresh_token
        })
    }

    logout = async (req, res, next) => {
        try {
            res.clearCookie('refresh_token', {path: '/api/v1/user/refresh_token'})
            return res.status(200).json({ status: 'Success', message: "Logout successfully!"})
        } catch (error) {
            return res.status(500).json({ status: 'Fail', message: error.message })
        }
    }

    // ...continue
    forgotPassword = async (req, res, next) => {
       try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email }})
            if (!user) {
                return res.status(404).json({ status: 'Fail', message: "Gmail is not used by account!" })
            }
            const accessToken = createAccessToken({id: user.id, type_user: "customer"}, '30m')

            const url = `${process.env.CLIENT_URL}/resetpassword/${accessToken}`
            const fullname = user.fullname
            console.log(`email`, email)

            sendMail(email, '30m')
            return res.status(200).json({
				status: 'Success',
				message: 'Send mail, please check to your gmail!',
			})
       } catch (error) {
            return res.status(500).json({ status: 'Faile', message: error.message })
       } 
    }

    // refresh token
    refreshToken = async (req, res) => {
        try {
            const refresh_token = req.cookies.refresh_token || req.query.refresh_token
            if (!refresh_token)  
                return res.status(403).json({ status: 'Fail', message: 'Vui lòng đăng nhập hoặc đăng ký!'})

            jwt.verify(
                refresh_token,
                process.env.REFRESH_TOKEN_SECRET,
                (error, user) => {
                    if (error) return res.status(419).json({
                        status: 'Fail',
                        message: 'Vui lòng đăng nhập hoặc đăng ký!'
                    })

                    const access_token = createAccessToken({ user_id: user.user_id, email: user.email, role_user: user.role_user })
                    return res.status(200).json({ status: 'Success', user, access_token})
                }
            )

        } catch (error) {
            return res.status(500).json({ status: 'Fail', message: error.message })
        }
    }

    // OAuth2 continue...

    loginSuccess = async (req, res, next) => {
        const { email } = req?.body
        try {
            if (!email) return res.status(400).json({
                message: "Missing inputs"
            })

            let respones = await authService.loginSuccessService(email)
            res.status(200).json(respones)
        } catch (error) {
            return res.status(500).json({ message: 'Fail at auth controller' + error })
        }
    }

    oauth2GoogleLogin = async (req, res) => {
        const redirectUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        const options = {
            redirect_uri: `https://localhost:8080/${redirectURI}`,
            client_id: process.env.GOOGLE_CLIENT_ID,
            access_type: "offline",
            response_type: "code",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
            ].join(" ")
        }

        return res.status(200).json({
            redirect_uri: `${redirectUrl}?${querystring.stringify(options)}`
        })
    }   

    oauth2GoogleCallback = async (req, res) => {
    }

}

module.exports = new AuthController()