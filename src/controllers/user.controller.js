'use strict'

const cloudinary = require("../utils/cloudinary")

const User = require("../models/user.model")
const sendMail = require("../utils/sendMail")
const bcrypt = require("bcrypt")
const moment = require("moment")
const { isValidCode } = require("../utils/validCode")

class UserController {

    getInfoUser = async (req, res) => {
        const user_id = req.params.user_id;
        const user = await User.findOne({
            where: {user_id},
            attributes: {
                exclude: ['access_token', 'refresh_token', 'createdAt', 'updatedAt', 'code', 'expired_time_code']
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
            const avatar = req.file.path
            const user_id = req.params.user_id
            const user = await User.findOne({ where: { user_id }})
            if (!user) {
                return res.status(404).json({Message: "Not found user!"})
            }
            const result = await cloudinary.uploader.upload(avatar)

            const data = {
                avatar: result.secure_url
            }
            const updated_user = await User.update(data, {
                where: { user_id }
            })
            if (updated_user != 1) {
                return res.status(403).json({ 
                    message: "Upload fail!"
                })
            }
            return res.status(200).json({ 
                url_image: result.secure_url,
                message: "Upload profile picture successfully!" 
            })
            

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

    forgotPassword = async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email }})
            if (!user) {
                return res.status(404).json({ status: 'Fail', message: "Gmail is not used by account!" })
            }
            const code = Math.floor(100000 + Math.random()*900000)
            const expirationTime = moment().add(2, 'minutes');
            user.code = code;
            user.expired_time_code = expirationTime;
            await user.save()
            console.log(`code`, user.code)
            console.log(`expiored`, user.expired_time_code)
            sendMail(email, code)
            return res.status(200).json({
                status: 'Success',
                message: 'Send mail, please check to your gmail!',
            })
        } catch (error) {
             return res.status(500).json({ status: 'Faile', message: error.message })
        } 
    }

    resetPassword = async (req, res, next) => {
        const { new_password, confirm_password, code } = req.body

        const user = await User.findOne({ where: { code }})

        if (!user) return res.status(400).json({ Message: "Not found user!"})
        console.log(`2`, user.code)

        if (user.code !== code) 
            return res.status(400).json({ Message: "Code is wrong!"})

        const checkValid = await isValidCode(user.expire_time_code);
        if (!checkValid) {
            user.expired_time_code = null;
            user.code = null;
            return res.status(400).json({ Message: "Code is expired!"})
        }
        
        if (new_password !== confirm_password) 
            return res.status(400).json({ Message: "Password doesn't match"})

        try {
            const hash_password = await bcrypt.hash(new_password, 10)
            const update_password = await User.update({ 
                password: hash_password, code: null, expired_time_code: null }, {
                    where: { code }
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

    proposeTour = async (req, res, next) => {
        
    }
}

module.exports = new UserController()