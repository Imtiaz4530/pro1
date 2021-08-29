const flash = require('../utility/Flash')
const Profile = require('../models/Profile')
const {validationResult} = require('express-validator')
const errorFormetter = require('../utility/validatorErrorFormatter')
const User = require('../models/User')
const Comment = require('../models/Comment')

exports.dashBoardGetController = async (req,res,next) => {
    try {
        let profile =await Profile.findOne({user:req.user._id})
            .populate({
                path : 'posts',
                select: 'title thumbnail'
            })
            .populate({
                path : 'bookmarks',
                select: 'title thumbnail'
            })
        if (profile) {
            res.render('pages/dashboard/dashboard', {title : 'My Dashboard', posts:profile.posts.reverse().slice(0, 3), profile, bookmarks:profile.bookmarks.reverse().slice(0, 3),  flashMessage : flash.getMessage(req)})
        }
        else{
            res.redirect('/dashboard/createProfile')            
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
    
}

exports.createProfileGetController =async (req,res,next) => {
    try {
        let profile = await Profile.findOne({user:req.user._id})
        if (profile) {
            res.redirect('/dashboard/editProfile')
        }else{
            res.render('pages/dashboard/createProfile', {title:'Create Your Profile', value: {},error: {}, flashMessage : flash.getMessage(req)})
        }
    } catch (e) {
        console.log(e);
        next(e)
    }
}

exports.createProfilePostController =async (req,res,next) => {
    let {name , title , bio , website , facebook , twitter , github} = req.body
    let errors = validationResult(req).formatWith(errorFormetter)
        if (!errors.isEmpty()) {
            req.flash('fail', 'Please check your form')
            res.render('pages/dashboard/createProfile', {
            title:'Create Your Profile',
            error : errors.mapped(),
            flashMessage : flash.getMessage(req),
            value :{name , title , bio, website , facebook , twitter , github}})
        }
    try {
        let profile = new Profile({
            user: req.user._id,
            name,title,bio,
            profilePics : req.user.profilePics,
            links : {
                website: website || '' , facebook:facebook || '', twitter:twitter || '', github:github || '',
            },
            posts:[],
            bookmarks:[]
        })
        let createdProfile = await profile.save()
        await User.findOneAndUpdate({_id:req.user._id},{$set: {profile : createdProfile._id}})
        req.flash('success', 'Profile created successfully')
        res.redirect('/dashboard')
    } catch (e) {
        console.log(e);
        next(e)
    }
    
}

exports.editProfilegetController =async (req,res,next) => {
    try {
        let profile =await Profile.findOne({user: req.user._id})
        if (!profile) {
            return res.redirect('/dashboard/createProfile')
        }
        res.render('pages/dashboard/editProfile', {title:'Edit Your Profile',error: {}, profile , flashMessage : flash.getMessage(req)})   
    } catch (e) {
        console.log(e);
        next(e)
    }
}

exports.editProfilePostController =async (req,res,next) => {
    let {name , title , bio , website , facebook , twitter , github} = req.body
    let errors = validationResult(req).formatWith(errorFormetter)
        if (!errors.isEmpty()) {
            req.flash('fail', 'Please check your form')
            res.render('pages/dashboard/editProfile', {
            title:'Create Your Profile',
            error : errors.mapped(),
            flashMessage : flash.getMessage(req),
            profile :{name , title , bio, links: {website , facebook , twitter , github}}})
        }
        try {
            let profile = {
                name,title,bio,
                links : {
                    website: website || '' , facebook:facebook || '', twitter:twitter || '', github:github || '',
                }
            }
            let upProfile =  await Profile.findOneAndUpdate({user:req.user._id},{$set: profile},{new:true})

            req.flash('success', 'Profile updated successfully')
            res.render('pages/dashboard/editProfile', {title:'Edit Your Profile', profile: upProfile  ,error: {}, flashMessage : flash.getMessage(req)})  
        } catch (e) {
            console.log(e);
            next(e)
        }
}

exports.bookmarkgetController =async (req,res,next) => {
    try {
        let profile = await Profile.findOne({user:req.user._id})
            .populate({
                path : 'bookmarks',
                model: 'Post',
                select: 'title thumbnail'
            })
        res.render('pages/dashboard/bookmark', {title:'Bookmark',error: {}, posts:profile.bookmarks , flashMessage : flash.getMessage(req)})   
    } catch (e) {
        console.log(e);
        next(e)
    }
}

exports.commentgetController =async (req,res,next) => {
    try {
        let profile = await Profile.findOne({user:req.user._id})
        let comments = await Comment.find({post: {$in: profile.posts}})
            .populate({
                path : 'post',
                select : 'title'
            })
            .populate({
                path : 'user',
                select : 'username profilePics'
            })
            .populate({
                path : 'replies.user',
                select : 'username profilePics'
            })
            res.render('pages/dashboard/comment', {title:'Comment',error: {}, comments , flashMessage : flash.getMessage(req)})  
       
    } catch (e) {
        console.log(e);
        next(e)
    }
}