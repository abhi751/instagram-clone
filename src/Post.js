import React, { useEffect, useState } from 'react'
import "./Post.css"
import {Avatar} from "@mui/material"
import { db } from './firebase'
import firebase from 'firebase';

function Post({username,caption,imageUrl,postId,user}) {
  const[comments,setComments]=useState([])
  const[comment,setComment]=useState("")
  useEffect(()=>{
    let unsubscribe;
    if(postId){
      unsubscribe=db
      .collection("post")
      .doc(postId)
      .collection("comments")
      .orderBy('timestamp','desc')
      .onSnapshot((snapshot)=>{
        setComments(snapshot.docs.map((doc)=>doc.data()));
      })
    }
    return()=>{
      unsubscribe();
    };
  },[postId])

  const postComment=(e)=>{
     e.preventDefault()
     db.collection("post").doc(postId).collection("comments").add({
      text:comment,
      username:user.displayName,
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
     });
     setComment('');
  }
  return (
    <div className='post'>
        <div className='post_header'>
        <Avatar sx={{bgcolor:"primary.light"}} src={imageUrl} className="post_avatar" alt="Abhishek" >
            AK
        </Avatar>
        <h3>{username}</h3>
        </div>
        <div className='post_image'>
        <img className='post_image' src={imageUrl} alt="avtar"/>
        </div>

        <h4 className='post_caption'><strong className='user'>{username}</strong>{caption}</h4>
        
          <div className='post_comments'>
            {
              comments.map((comment)=>(
                <p>
                  <strong>{comment.username}</strong>{comment.text}
                </p>
              ))
            }
          </div>
          {user &&(
             <form className='post_commentBox'>
             <input className='post_input' type="text" placeholder='Add Comments...' value={comment} onChange={(e)=>setComment(e.target.value)}></input>
             
             <button className='post_button' type='submit' disabled={!comment} onClick={postComment}>Post</button>
           </form>
          )}
    </div>
  )
}

export default Post     