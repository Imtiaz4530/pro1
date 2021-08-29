const Flash = require("../utility/Flash")
const {validationResult} = require('express-validator')
const errorFormetter = require('../utility/validatorErrorFormatter')
const readingtime = require('reading-time')
const Post = require("../models/Post")
const Profile = require("../models/Profile")


exports.createPostGetController = (req,res,next)=> {
    let errors = validationResult(req).formatWith(errorFormetter)
    res.render('pages/dashboard/post/createpost',{
        title : 'Create Post',
        error:{},
        value: {},
        flashMessage:Flash.getMessage(req)
    })
}

exports.createPostPostController =async (req,res,next)=> {
    let {title , body , tags} = req.body
    let errors = validationResult(req).formatWith(errorFormetter)
    if (!errors.isEmpty()) {
        req.flash('fail', 'Post creation failed')
        return res.render('pages/dashboard/post/createpost', {title : 'Create a post' ,
                error : errors.mapped() ,
                value : {title , body},
                flashMessage : Flash.getMessage(req)
            })
    }
    if (tags) {
        tags = tags.split(',')
        tags = tags.map(t => t.trim())
    }
    let readTime = readingtime(body).text
    let post = new Post({
        title, body , tags,
        author : req.user._id,
        thumbnail :'',
        readTime,
        likes:[],dislikes:[],comments:[]
    })
    if (req.file) {
        post.thumbnail = `/upload/${req.file.filename}`
    }
    try {
        let createPost = await post.save()
        await Profile.findOneAndUpdate({user: req.user._id},{$push: {'posts' : createPost._id}})
        req.flash('success', 'Post created successfully')
        res.redirect(`/posts/edit/${createPost._id}`)
    } catch (e) {
        console.log(e);
        next(e)
    }
}


exports.editPostGetController =async (req,res,next)=> {
    let postID = req.params.postId

    try {
        let post = await Post.findOne({author: req.user._id, _id:postID})
    if (!post) {
        let error = new Error(`404 post not found`)
        error.status = 404
        throw error
    }
    res.render('pages/dashboard/post/editPost', {title : 'Edit your post' ,
    error :{} ,
    post,
    flashMessage : Flash.getMessage(req)
    })
    } catch (e) {
        console.log(e);
        next(e)
    }
}

exports.editPostPostController =async (req,res,next)=> {
    let {title , body , tags} = req.body
    let postID = req.params.postId
    let errors = validationResult(req).formatWith(errorFormetter)
    try {
        let post = await Post.findOne({author: req.user._id, _id:postID})
        if (!post) {
            let error = new Error(`404 post not found`)
            error.status = 404
            throw error
        }
        if (!errors.isEmpty()) {
            req.flash('fail', 'Post updated failed')
            return res.render('pages/dashboard/post/createpost', {title : 'Create a post' ,
                    error : errors.mapped() ,
                    value : {title , body},
                    flashMessage : Flash.getMessage(req),
                    post
                })
        }
        if (tags) {
            tags = tags.split(',')
            tags = tags.map(t => t.trim())
        }
        let thumbnail = post.thumbnail
        if (req.file) {
            thumbnail = req.file.filename
        }
        
        await Post.findByIdAndUpdate({_id: post._id},{$set : {title,body,tags,thumbnail}}, {new:true})
        req.flash('success', 'Post updated successfully')
        res.redirect('/posts/edit/' + post._id)
    } catch (e) {
        console.log(e)
        next(e)
    }
}

exports.deletePostController =async (req,res,next)=> {
    let  postID  = req.params.postId
    try {
        let post = await Post.findOne({author:req.user._id , _id:postID})
        if (!post) {
            let error = new Error(`Post doesnot exist`)
            error.status = 404
            throw error
        }
        await Post.findOneAndDelete({_id:postID})
        await Profile.findOneAndUpdate({user:req.user._id},{$pull: {'posts':postID}})
        req.flash('success', 'Post deleted successfully')
        res.redirect('/posts')
    } catch (e) {
        console.log(e);
        next(e)
    }
}

exports.getAllPosts =async (req,res,next)=> {
    try {
       let posts = await Post.find({author: req.user._id})
       res.render('pages/dashboard/post/posts', {
           title : 'My all post',
           flashMessage : Flash.getMessage(req),
           posts
       })
    } catch (e) {
        console.log(e);
        next(e)
    }
}