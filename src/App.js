import React,{ useState,useEffect } from 'react';
import './App.css';
import Post from './Post';
 import {db,auth} from "./firebase"
import {Modal,Button,Box, Typography,Input} from "@mui/material"
import ImageUpload from './ImageUpload';

function App() {
  
  const[posts,setPosts] =useState([]);
  const[open,setOpen]=useState(false);
  const[username,setUsername]=useState("");
  const[password,setPassword]=useState("");
  const[email,setEmail]=useState("");
  const [user,setUser]=useState(null)
  const[openSignIn,setOpenSignIn]=useState(false)

  useEffect(()=>{
     const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){ 
        console.log(authUser);
        setUser(authUser)
      }else{
        setUser(null)
      }
     })
     return ()=>{
      unsubscribe();
     }
  },[user,username])
  
  useEffect(()=>{
    db.collection("post").onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({
        id:doc.id,
        post:doc.data()
      })))
    }) 
  },[]); 

  const signup=(event)=>{
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username,
      })
    })
    .catch((error)=>alert(error.message))
    setOpen(false);
  }
  const signIn=(event)=>{
    event.preventDefault()
    auth.signInWithEmailAndPassword(email,password) 
    .catch((error)=>alert(error.message))
    setOpenSignIn(false)
  }
  return (
    <div className="App"> 
      <Modal 
        open={open}
        onClose={()=>setOpen(false)} 
      >
        <Box  width= "100px" height="100px" position="absolute" top="50%" left="50%">
          <Typography>
            <form>
            <div className='signupForm'>
                <center>
                  <div className="image1">
                    <img className="header_img"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuxWHe8-sEoPC1AeCAZmpkawHbXoCVLDQSap0d3JOrwFylNaHkk9L4robLid6NO_uBqQ&usqp=CAU"
                      alt="App_icon"/>
                  </div>
                  <Input 
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                  />
                  <Input 
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                   <Input 
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                  <Button type={'submit'} onClick={signup}>signup</Button>
              
                </center>

              </div>
            </form>  
          </Typography>
        </Box>
      </Modal>
      <Modal 
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)} 
      >
        <Box  width= "100px" height="100px" position="absolute" top="50%" left="50%">
          <Typography>
            <form>
            <div className='signupForm'>
                <center>
                  <div className="image1">
                    <img className="header_img"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuxWHe8-sEoPC1AeCAZmpkawHbXoCVLDQSap0d3JOrwFylNaHkk9L4robLid6NO_uBqQ&usqp=CAU"
                      alt="App_icon"/>
                  </div>
                  <Input 
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                   <Input 
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                  <Button type={'submit'} onClick={signIn}>sign In</Button>
              
                </center>

              </div>
            </form>  
          </Typography>
        </Box>
      </Modal>
      <div className="header">
        <img className="header_img"
           src="https://pnclogos.com.au/wp-content/uploads/2021/07/02.jpg"
           alt="App_icon"
        />
        {user?(
          <Button onClick={()=>auth.signOut()}>Logout</Button>
        ):(
          <div className='app_loginContainer'>
            <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
          
        )}
      </div>
      <div className='app_post'>
        {
          posts.map(({id,post})=>(
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}  />
          ))
        }
      </div>
        {user?.displayName?(
            <ImageUpload username={user.displayName}/>
         ):(
            <h3>Sorry you need to signup</h3>
        )}
    </div>
  );
}  

export default App;
