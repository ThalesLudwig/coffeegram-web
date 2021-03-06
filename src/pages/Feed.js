import React, { Component } from 'react'
import api from '../services/api'
import io from 'socket.io-client'
import hostPath from '../env'
import './Feed.css'
import more from '../assets/more.svg'
import like from '../assets/like.svg'
import comment from '../assets/comment.svg'
import send from '../assets/send.svg'
import beans from '../assets/beans.svg'

class Feed extends Component {

    state = {
        feed: []
    }

    handleLike = id => {
        api.post(`posts/${id}/like`)
    }

    async componentDidMount() {
        this.registerToSocket()
        const response = await api.get('posts')
        this.setState({ feed: response.data })
    }

    registerToSocket = () => {
        const socket = io(hostPath)
        socket.on('post', newPost => {
            this.setState({ feed: [newPost, ...this.state.feed] })
        })
        socket.on('like', likedPost => {
            this.setState({ 
                feed: this.state.feed.map(post => 
                    post._id === likedPost._id ? likedPost : post)
            })
        })
    }

    render() {
        if (this.state.feed.length > 0) {
            return (
                <section id="post-list">
                    { this.state.feed.map(post => (
                        <article key={post._id}>
                            <header>
                                <div className="user-info">
                                    <span>{post.author}</span>
                                    <span className="place">{post.place}</span>
                                </div>
                                <img src={more} alt="more" width="25px" height="25px"></img>
                            </header>
                            <img src={`${hostPath}/files/${post.image}`} alt=""/>
                            <footer>
                                <div className="actions">
                                    <button type="button" onClick={() => this.handleLike(post._id)}>
                                        <img src={like} alt="like" width="25px" height="25px"/>
                                    </button>
                                    <img src={comment} alt="comment" width="25px" height="25px"/>
                                    <img src={send} alt="send" width="25px" height="25px"/>
                                </div>
                                <strong>{post.likes} likes</strong>
                                <p>
                                    {post.description}
                                    <span>{post.hashtags}</span>
                                </p>
                            </footer>
                        </article>
                    )) }
                </section>
            )
        } else {
            return (
                <section id="post-list">
                    <div id="no-posts">
                        <img src={beans} alt="beans" height="80px" />
                        <p>No coffee yet. :(</p>
                        <p>Try adding something!</p>
                    </div>
                </section>
            )
        }
    }

}

export default Feed