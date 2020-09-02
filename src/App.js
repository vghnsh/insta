import React,{useState,useEffect} from 'react';
import Post from '../../insta/src/components/post.component';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Input} from '@material-ui/core';
import ImageUpload from '../../insta/src/components/imageupload.component';
import './App.css';
import {db ,auth} from './firebase';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: window.matchMedia( "(max-width: 570px)" ).matches === true ? 270 : 400,
    
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
  const classes=useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [post,setPost]=useState([]);
  const [open,setOpen]= useState(false);
  const [opensign,setOpensign]= useState(false);

  const [username,setUsername]=useState('');
  const [email, setEmail]= useState('');
  const [password,setPassword]=useState('');
  const [user,setUser] = useState(null);
  
  useEffect(()=>{
    const unsubsribe= auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        
       
          setUser(authUser);
        
        
      }
      else{
        setUser(null);
      }
      
      return()=>{
        unsubsribe();
      };
    });
  },[user,username]);

  useEffect(() => {

    
    db.collection('post').orderBy("timestamp","desc").onSnapshot(snapshot =>{
      setPost(snapshot.docs.map(doc=> ({
        id:doc.id,
        post:doc.data()
      })));
    })
  
}, []);

const signUp=(event)=>{
  event.preventDefault();

  auth.createUserWithEmailAndPassword(email, password)
  .then((authUser)=>{
    return authUser.user.updateProfile({
      displayName : username
    })
  })
  .catch((error)=>alert(error.message));
  setEmail('');
  setPassword('');
  setUsername('');
  setUser(null);
  setOpen(false);
  setOpensign(true);
};

const signIn=(event)=>{
  event.preventDefault();

  auth.signInWithEmailAndPassword(email,password)
  .catch((error)=>alert(error.message));
  setEmail('');
  setPassword('');
  setOpensign(false);
};

const signOut=(event)=>{
  event.preventDefault();
  
  auth.signOut();
  
  
};

  return (
    <div className="App">
     
       <Modal
        open={open}
        onClose={()=>setOpen(false)}>
          <center>
          <div style={modalStyle} className= {classes.paper}>
            <form className="model"> 
            <h2 id="simple-modal-title">Text in a modal</h2>
            
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            ></Input>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            ></Input>         
           
           <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            ></Input>  

            <Button onClick={signUp}>Sign Up</Button>        
            </form>
          </div>
          
          </center>
          
      </Modal>

      <Modal
        open={opensign}
        onClose={()=>setOpensign(false)}
        >  
          <div style={modalStyle} className= {classes.paper}>
            <form className="model"> 
            <h2 id="simple-modal-title">Text in a modal</h2>
            
            
          
            
            <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
          ></Input>  

            <Input
              placeholder="password"
              type="text"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            ></Input>  

            <Button onClick={signIn}>Sign In</Button> 
            </form>
        </div>
      </Modal>

         <div className="Header_App">
            {/* Header*/}
            
            <img 
            src="insta.png" 
            alt="img">

            </img>
            {
          user?(
          <Button onClick={signOut} color="primary">Log Out</Button>
          ):
          <div className="log">
            <Button onClick={()=>setOpensign(true)} color="secondary">Sign In</Button>
            <Button onClick={()=>setOpen(true)} color="primary">Sign Up</Button>

          </div>
        }
          </div>

          {
        user?.displayName?(
          <ImageUpload username= {user.displayName}/>
     
        ):(<center>
          <h1>LogIn to Upload</h1>
        </center>
          
        )
      }

        

        {
          post.map(({id,post})=>(
            <Post key={id} postId={id} user={user}  username={post.username} imageUrl={post.imageUrl} caption={post.caption}></Post>
            ))
        }
          
          
    </div>
  );
}

export default App;
