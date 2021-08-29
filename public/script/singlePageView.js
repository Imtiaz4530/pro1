
    const bookmarks = document.getElementsByClassName('bookmark')
    ;[...bookmarks].forEach(bookmark => {
        bookmark.style.cursor = 'pointer'
        bookmark.addEventListener('click', function (e){
            let target = e.target.parentElement
            
            let headers = new Headers()
            headers.append('Accept', 'Application/JSON')

            let req = new Request(`/api/bookmarks/${target.dataset.post}`, {
                method : 'GET',
                headers,
                mode:'cors'
            })

            fetch(req).then(res => res.json)
                .then(data => {
                    if (data.bookmark) {
                        target.innerHTML =  `<i class="fas fa-bookmark"></i>`
                    }else {
                        target.innerHTML =  `<i class="far fa-bookmark"></i>`
                    }
                })
                .catch(e => {
                    console.log(e.response.data.error)
                    alert(e.response.data.error)
                })
        })
    });
    

    const likeBtn = document.getElementById('LikeBtn')
    const dislikeBtn = document.getElementById('DislikeBtn')
    likeBtn.addEventListener('click', e => {
        
        let postId = likeBtn.dataset.post
        reqLikeDislike('likes', postId).then(res => res.json())
                                    .then(data => {
                                       let likeText = data.liked ? 'Liked' : 'Like'
                                       likeText = likeText + `(${data.totalLikes})`
                                       let dislikeText = `Dislikes (${data.totalDisLikes})`
                                       
                                       likeBtn.innerHTML = likeText
                                       dislikeBtn.innerHTML = dislikeText
                                    })
                    .catch(e => {
                        console.log(e)
                        alert(e.response.data.error)
                    })
    })
    dislikeBtn.addEventListener('click', e => {
        let postId = dislikeBtn.dataset.post
        reqLikeDislike('dislikes', postId).then(res => res.json())
                                    .then(data => {
                                       let dislikeText = data.disliked ? 'Disliked' : 'Dislike'
                                       dislikeText = dislikeText +`(${data.totalDisLikes})`
                                       let likeText = `Likes (${data.totalLikes})`
                                       
                                       dislikeBtn.innerHTML = dislikeText
                                       likeBtn.innerHTML = likeText
                                    })
                    .catch(e => {
                        console.log(e.message)
                        alert(e.message)
                    })
    })

    function reqLikeDislike(type, postId){
        let headers = new Headers()
        headers.append('Accept', 'Application/JSON')
        headers.append('Content-Type', 'Application/JSON')

        let req = new Request(`/api/${type}/${postId}`, {
            method: 'GET',
            headers,
            mode:'cors'
        })

        return fetch(req)
    }



    window.onload = () => {
        const comment = document.getElementById('comment')
        const commentHolder = document.getElementById('comment-holder')
    
        comment.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                if (e.target.value) {
                    let postId = comment.dataset.post
                    let data  = {
                        body: e.target.value
                    }
                    let req  = postComment(`/api/comments/${postId}`,'POST',data)
                    fetch(req).then(res => res.json())
                                .then(data => {
                                    let commentElement = createComment(data)
                                    commentHolder.insertBefore(commentElement, commentHolder.children[0])
                                    e.target.value = ''
                                }).catch(e => {
                                    console.log(e.message)
                                    alert(e.message)
                                })
                }else{
                    alert(`Please enter a valid comment`)
                }
            }
        })
        commentHolder.addEventListener('keypress', e => {
            if (commentHolder.hasChildNodes(e.target)) {
                if (e.key === 'Enter') {
                    let commentId = e.target.dataset.comment
                    let value = e.target.value
                    if (value) {
                        let data  = {
                            body: value
                        }
                        let req = postComment(`/api/comments/replies/${commentId}`, 'POST', data)
                        fetch(req).then(res => res.json())
                                .then(data => {
                                    let replyElement = createReply(data)
                                    let parent = e.target.parentElement
                                    parent.previousElementSibling.appendChild(replyElement)
                                    e.target.value = ''
                                }).catch(e => {
                                    console.log(e.message)
                                    alert(e.message)
                                })
                    }else{
                        alert(`Please enter a valid comment`)
                    }
                }
            }
        })
    }
    function postComment(url, method, body) {
        let headers = new Headers()
            headers.append('Accept', 'Application/JSON')
            headers.append('Content-Type', 'Application/JSON')
    
            let req = new Request(url, {
                method,
                headers,
                body: JSON.stringify(body),
                mode:'cors'
            })
    
        return req
    }
    
    function createComment(comment) {
        let innerHTML = `
            <img src="${comment.user.profilePics}" class="rounded-circle mx-3 my-3" style="width: 40px">
            <div class="media-body my-3">
                <p>${comment.body}</p>
                <div class="my-3">
                    <input type="text" class="form-control" placeholder="Press To Enter Reply" name="reply" data-comments="${comment._id}">
                </div>
            </div>`
        let div = document.createElement('div')
        div.className = 'media border'
        div.innerHTML = innerHTML
    
        return div
    }
    
    function createReply(reply) {
        let innerHTML = `
            <img src="${reply.profilePics}" class="rounded-circle mr-3 aling-self-start" style="width: 40px">
            <div class="media-body my-3">
                <p>${reply.body}</p>
            </div>`
        let div = document.createElement('div')
        div.className = 'media mt-3'
        div.innerHTML = innerHTML
    
        return div
    }