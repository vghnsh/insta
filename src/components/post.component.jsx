import React, { useEffect,useState } from 'react'
import './post.style.scss';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../firebase';

const Post=({username, imageUrl,caption,postId,user})=> {

    const[comments,setComments]= useState([]);
    const[comment,setComment]=useState('');

    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe=db
            .collection("post")
            .doc(postId)
            .collection("comments")
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            });
        }

        return()=>{
            unsubscribe();
        };
    },[postId]);


    const postComment=(event)=>{

        event.preventDefault();
        db.collection('post').doc(postId).collection('comments').add(
          {
            text:comment,
            username:user.displayName
          }
        )
    }

    return (
            <div className="post center">

                <div className="post_header" >
                    <Avatar 
                    
                    alt={username}
                    
                    />
                    <h3>{username}</h3>
                </div>
                {/* header - avater + username*/}

                <div className="post_img center">
                    <img
                        src={imageUrl}
                        alt="img"
                    ></img>
                </div>
                {/* image */}
                <div className="caption">
                <strong>{username}</strong>{caption}
                
                </div>
                {/*Caption*/}
                <div>
                    {
                        comments.map((comment)=>(
                            <p>
                                <b>{comment.username}</b>{comment.text}
                            </p>
                        ))
                    }
                </div>

                { 
                
                user?(

                    <form className="comment-box">
                    <input
                        className="post_input"
                        type="text"
                        placeholder="Comment Here"
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}

                    >
                        
                    </input>
                    <button
                        className="post_btn"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                    </form>
                ):
                <h4>LogIn to Comment</h4>
                }
                
        </div>
        
     
    )
}

export default Post;