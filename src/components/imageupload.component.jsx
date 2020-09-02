import React , {useState} from 'react'
import {Button} from '@material-ui/core';
import './imageupload.css';

import { db ,storage} from '../firebase';

const Imageupload =({username}) =>  {
    const [image,setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');


    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload=()=>{

        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes)*100
                    );
                    setProgress(progress);
                },

                (error)=>{
                    alert(error.message);
                },

                ()=>{
                    storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("post").add({
                            timestamp:new Date().toLocaleString(),
                            caption:caption,
                            imageUrl:url,
                            username:username
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
                }


                );
            };
    return (
        <div className="imageUpload">
            <progress className="prog" value={progress} max="100"></progress>
            <input 
            type="text" 
            placeholder="Enter Your Caption"
            onChange={(e)=>setCaption(e.target.value)}
            ></input>

            <input
            type="file"
            onChange={handleChange}

            >
            </input>
            <Button onClick={handleUpload}>
            Upload
            </Button>
        </div>
    )
}

export default Imageupload;
