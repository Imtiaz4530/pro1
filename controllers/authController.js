const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const errorFormetter = require('../utility/validatorErrorFormatter')
const User = require('../models/User')
const Flash = require('../utility/Flash')

exports.singupGetController = (req,res,next)  => {
    res.render('pages/auth/singup', {title : 'SingUp' , error: {} , value : {},flashMessage : Flash.getMessage(req)})
}


exports.singupPostController =async (req,res,next)  => {
    let {username, email, password} = req.body
    let errors = validationResult(req).formatWith(errorFormetter)
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your form')
        return res.render('pages/auth/singup', {title : 'SingUp' ,
                error : errors.mapped() ,
                value : {username , email , password},
                flashMessage : Flash.getMessage(req)
            })
    }
    try {
        let hashedpassword =await bcrypt.hash(password, 11)
        let user = new User({username,email,password:hashedpassword})
        await user.save()
        req.flash('success', 'User created successfully')
        res.redirect('/auth/login')
    } catch (e) {
        console.log(e)
    }
}


exports.loginGetController = (req,res,next)  => {
    res.render('pages/auth/login', {title : 'Login', error: {},value : {},flashMessage : Flash.getMessage(req) })
}


exports.loginPostController = async (req,res,next)  => {
    let {email, password} = req.body
    let errors = validationResult(req).formatWith(errorFormetter)
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your form')
        return res.render('pages/auth/login', {title : 'Login' ,
                error : errors.mapped() ,
                value : {email , password},
                flashMessage : Flash.getMessage(req)
            })
    }
    try {
        let user = await User.findOne({email})
        if (!user) {
            req.flash('fail', 'Please Provide valid credentials')
            return res.render('pages/auth/login', {title : 'Login' ,
                error : {},
                flashMessage : Flash.getMessage(req)
            }) 
        }
        let match =await bcrypt.compare(password, user.password)
        if (!match) {
            req.flash('fail', 'Please Provide valid credentials')
            return res.render('pages/auth/login', {title : 'Login' ,
                error : {},
                flashMessage : Flash.getMessage(req)
            })   
        }
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(e => {
            if (e) {
                console.log(e);
                return next(e)
            }
            req.flash('success', 'User created successfully')
            res.redirect('/dashboard')
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}
exports.logoutController = (req,res,next)  => {
    req.session.destroy(e => {
        if (e) {
            console.log(e);
            return next(e)
        }
        res.redirect('/auth/login')
    })
}

exports.changePasswordGetController = async (req,res,next)  => {
    res.render('pages/auth/passChange', {title : 'Change my password' ,
                error : {},
                flashMessage : Flash.getMessage(req)
            })
}

exports.changePasswordPostController = async (req,res,next)  => {
    let {oldpassword, newpassword, confirmpassword} = req.body
    
    try {
        if (newpassword !== confirmpassword) {
            req.flash('fail', 'Password doesnot match')
            return res.redirect('/auth/change-password')
        }
        let match =await bcrypt.compare(oldpassword, req.user.password)
        if (!match) {
            req.flash('fail', 'Invalid old password')
            return res.redirect('/auth/change-password')
        }
        let hashedpassword =await bcrypt.hash(newpassword, 11)
        await User.findOneAndUpdate({_id: req.user._id}, {$set: {password: hashedpassword}})
        
        req.flash('success', 'Password change successfully')
        return res.redirect('/dashboard')
    } catch (error) {
        console.log(e);
        next(e)
    }

    res.render('pages/auth/passChange', {title : 'Change my password' ,
                error : {},
                flashMessage : Flash.getMessage(req)
    })
}