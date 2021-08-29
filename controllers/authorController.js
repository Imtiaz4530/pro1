const Flash = require('../utility/Flash')
const User = require('../models/User')
const Post = require('../models/Post')
const Profile = require('../models/Profile');

exports.authorProfileGetController =async (req, res, next) => {
    let  userId  = req.params.userId

    try {
        let author =await User.findById(userId)
            .populate({
                path: 'profile',
                    populate: {
                        path: 'posts'
                    }
            })
            console.log(author.profile.posts.title);
            let bookmarks = []
            if (req.user) {
                let profile = await Profile.findOne({user:req.user._id})
                if (profile) {
                    bookmarks = profile.bookmarks
                }
            }

            res.render('pages/explorer/author',{title : "Author" ,
            flashMessage : Flash.getMessage(req),
            author, bookmarks
            })
    } catch (e) {
        console.log(e)
        next(e)
    }

    
}