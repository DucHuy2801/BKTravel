'use strict'

const User = require("../models/user.model")
const sendMail = require("../utils/sendMail")
const bcrypt = require("bcrypt")
const { createAccessToken } = require("../services/auth.service")
const jwt = require("jsonwebtoken")

class UserController {

    getInfoUser = async (req, res) => {
        const user_id = req.params.user_id;
        const user = await User.findOne({
            where: {user_id},
            attributes: {
                exclude: ['access_token', 'refresh_token', 'createdAt', 'updatedAt']
            }
        })
        if (!user) return res.status(404).json({ Message: "User doesn't exist!"})
        return res.status(200).json({
            user_info: user
        })
    }

    updateInfoUser = async (req, res) => {
        const user_id = req.params.user_id
        const update_info = req.body
        const result = await User.update(update_info, {
            where: { user_id }
        })

        const updated_user = await User.findOne({ 
            where: { user_id },
            attributes: {
                exclude: ['access_token', 'refresh_token', 'createdAt', 'updatedAt']
            }
        })
        return res.status(200).json({ 
            status: "Update user's info successfully!",
            data: updated_user
        })
    }

    uploadAvatar = async (req, res) => {
        try {
            const avatar = req.file.filename
            const user_id = req.params.user_id
            const user = await User.findOne({ where: { user_id }})
            if (!user) {
                return res.status(404).json({Message: "Not found user!"})
            }
            const data = {
                avatar: avatar
            }
            const updated_user = await User.update(data, {
                where: { user_id }
            })
            if (updated_user != 1) {
                return res.status(403).json({ message: "Upload fail!"})
            }
            return res.status(200).json({ message: "Upload profile picture successfully!" })
            

        } catch (error) {
            return res.status(404).json({
                message: "false"
            })
        }
    }

    changePassword = async (req, res, next) => {
        const email = req.body.email;
        const old_password = req.body.old_password;
        const new_password = req.body.new_password;
        const confirm_password = req.body.new_password;

        const user = await User.findOne({ where: { email }})
        if (!user) 
            return res.status(404).json({ Message: "Not found user!" })

        const match = bcrypt.compareSync(old_password, user.password)
        if (!match)
            return res.status(400).json({ Message: "Password is wronng!" }) 

        if (confirm_password !== new_password) 
            return res.status(500).json({ Message: "Password doesn't match!"})
        const password = await bcrypt.hash(new_password, 10)
        const update_password = await User.update(
            { password: password },
            { where: { email }}
        )
        if (!update_password) return res.status(500).json({Message: "Change password fail!"})
        return res.status(200).json
    }

    // ...continue
    forgotPassword = async (req, res, next) => {
        try {
             const { email } = req.body;
             const user = await User.findOne({ where: { email }})
             if (!user) {
                 return res.status(404).json({ status: 'Fail', message: "Gmail is not used by account!" })
             }
             const accessToken = await createAccessToken({
                user_id: user.user_id, email: user.email, type_user: "customer"}, '30m')
 
             const url = `${process.env.URL_CLIENT}/user/reset-password/${accessToken}`
 
             sendMail(email, url, '30m')
             return res.status(200).json({
                 status: 'Success',
                 message: 'Send mail, please check to your gmail!',
             })
        } catch (error) {
             return res.status(500).json({ status: 'Faile', message: error.message })
        } 
    }

    resetPassword = async (req, res, next) => {
        const { user_id, access_token } = req.params
        const { new_password, confirm_password } = req.body

        const user = User.findOne({ where: { user_id }})
        if (!user) return res.status(400).json({ Message: "Not found user!"})

        if (new_password !== confirm_password) 
            return res.status(400).json({ Message: "Password doesn't match"})

        try {
            const is_verify = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET)
            const hash_password = await bcrypt.hash(new_password, 10)
            const update_password = await User.update({ 
                password: hash_password}, {
                    where: { user_id }
                }
            )
            if (!update_password) {
                return res.status(400).json({ Message: "Change password fail!"})
            }
            return res.status(200).json({ Message: "Change password successfully!"})
        } catch (error) {
            console.log(error)
            return res.status(404).json({ Message: error })
        }
        
    }

}

module.exports = new UserController()