const {Schema,model} = require('mongoose')

const Comment = require('./Comment')

const postSchema = new Schema({
    title : {
        type : String,
        trim:true,
        maxlength:70,
        required : true
    },
    body : {
        type : String,
        maxlength:5000,
        required : true
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    tags : {
        type : [String]
    },
    thumbnail : String,
    readTime : String,
    likes : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    dislikes : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    comments : [{
        type : Schema.Types.ObjectId,
        ref : 'Comment'
    }]
}, {timestamps : true})
postSchema.index({
    title : 'text',
    body : 'text',
    tags : 'text',
},{weights : {
title : 5,
body : 5,
tags : 3,
}})
const Post = model('Post',postSchema)
module.exports = Post 