const fs = require('fs')
const User = require('../models/User')
const Profile = require('../models/Profile');


exports.uploadProfilePic =async (req,res,next) => {
    if (req.file) {
        try {
            let oldProPic = req.user.profilePics
            let profile = await Profile.findOne({user: req.user._id})
            let profilePics = `/upload/${req.file.filename}`
            if (profile) {
                await Profile.findOneAndUpdate({user : req.user._id},{$set: {profilePics}} )
            } 
            await User.findOneAndUpdate(
                    {_id: req.user._id},
                    {$set: {profilePics}})
                if (oldProPic !== '/upload/R.png') {
                    fs.unlink(`public${oldProPic}`, err => {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
                res.status(200).json({profilePics})
            } catch (e) {
            // res.status(500).json({
            //     profilePics: '/upload/R.png'
            // })
            console.log(e);
        }
    }else{
            // res.status(500).json({
            //     profilePics: '/upload/R.png'
            // })
    }
}

exports.removeProfilePics = (req, res, next)=> {
    try {
        let defaultProPic = '/upload/R.png' 
        let currentProPic = req.user.profilePics
        fs.unlink(`public${currentProPic}`,async (err)=> {
            let profile =await Profile.findOne({user: req.user._id})
            if (profile) {
                await Profile.findOneAndUpdate(
                    {user: req.user._id},
                    {$set : {profilePics : defaultProPic}}
                )
            }
            await User.findOneAndUpdate(
                {_id: req.user._id},
                {$set : {profilePics : defaultProPic}}
            )
        })
        res.status(200).json({
            profilePics : defaultProPic
        })

    } catch (e) {
        console.log(e);
        // res.status(500).json({
            //profilePics: '/upload/R.png'
        //})
    }
}

exports.postImageController = (req,res,next )=> {
    if (req.file) {
        return res.status(200).json({
            imgUrl : `/upload/${req.file.filename}`
        })}
        return res.status(500).json({
        message : 'Server Error'
        })
}

exports.getUpload = (req,res,next )=> {
    res.render('upload/up' ,{title :"Playground", flashMessage: {}})
}

exports.postUpload =(req,res,next )=> {
    if (req.file) {
        console.log(file);
    }
    res.redirect('/upload/play' ,{title :"Playground", flashMessage: {}})
}