const authRoute = require('./authRoute')
const dashboardRoute = require('./dashboardRoute')
const upload = require('./uploadroute')
const post = require('./postRoute')
const api = require('../API/routes/apiRoutes')
const explorer = require('./exploreRoute')
const search = require('./searchRoute')
const author = require('./authorRoute')

const routes = [
    {
        path:'/auth',
        handler:authRoute
    },
    {
        path:'/dashboard', 
        handler: dashboardRoute
    },
    {
        path: '/upload',
        handler: upload
    },
    {
        path: "/posts",
        handler :post
    },
    {
        path: "/api",
        handler :api
    },
    {
        path: "/explorer",
        handler :explorer
    },
    {
        path: "/search",
        handler :search
    },
    {
        path: "/author",
        handler :author
    },
    {
        path:'/',
        handler:(req,res) => {
            res.redirect('/explorer')
        }
    }
]



module.exports = (app)=>{
    routes.forEach(r => {
        if (r.path === '/') {
            app.get(r.path, r.handler)
        } else {
            app.use(r.path, r.handler)
        }
    });
}