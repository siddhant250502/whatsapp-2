import {Avatar, IconButton} from "@mui/material";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import {auth,db} from "../firebase";
import MoreVert from "@mui/icons-material/MoreVert";
import AttachFile from "@mui/icons-material/AttachFile";
import InsertEmoticonOutlined from "@mui/icons-material/InsertEmoticonOutlined";
import MicIcon from '@mui/icons-material/Mic';
import Message from "./Message";
import {useCollection} from "react-firebase-hooks/firestore";
import { useState } from "react";
import { useRef } from "react";
import firebase from 'firebase/compat/app';
import getRecipientEmail from "../utils/getRecipientEmail";


function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);
    const [input,setInput] = useState();
    const endOfMessageRef = useRef(null);
    const router = useRouter();
    const [messagesSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp','asc'));

    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(chat.users,user))
    )
    const showMessages = () => {
        if(messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message 
                key={message.id} 
                user={message.data().user}
                message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime(),
                }}
             />
            ));  
        } 
        else {
            return JSON.parse(messages).map(message => (
                <Message 
                key={message.id} user={message.user} message={message}
                />
            ));  
        }
    };

    const scrolltobottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behaviour: 'smooth',
            block:'start',
        });
    }
    const sendMessage = (e) => {
        e.preventDefault();

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user:user.email,
            photoURL: user.photoURL,
        })

        setInput("");
        scrolltobottom();
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);


return (
    <Container>
        <Header>
            {recipient ? (
                <Avatar src={recipient?.photoURL}/>
            ) : (
                <Avatar>{recipientEmail[0]}</Avatar>
            )}

            <HeaderInformation>
                <h3>{recipientEmail}</h3>
            </HeaderInformation>
            <HeaderIcons>
                <IconButton>
                    <AttachFile/>
                </IconButton>
                <IconButton>
                    <MoreVert/>
                </IconButton>
            </HeaderIcons>
        </Header>

        <MessageContainer>
            {showMessages()}
            <EndOfMessage ref={endOfMessageRef}/>
        </MessageContainer>

        <InputContainer>
            <Mybutton>
                <InsertEmoticonOutlined color="black"/>
            </Mybutton>
                <Input value={input} onChange={(e) => setInput(e.target.value)}/>
                <button hidden color="black" disabled={!input} type="submit" onClick={sendMessage} >Send message</button>
            <Mybutton>
                <MicIcon />
            </Mybutton>
                
        </InputContainer>  
    </Container>
  )
}

export default ChatScreen;

const Container = styled.div`
  
`
const Header= styled.div`
position:sticky;
background-color: white;
z-index:100;
top:0;
display:flex;
padding:11px;
height:80px;
align-items: center;
border-bottom: 1px solid whitesmoke;
`

const HeaderInformation= styled.div`
margin-left:15px;
flex:1;

>h3{
    margin-bottom:20px;
    color:black;
}
`;

const HeaderIcons= styled.div``;

const EndOfMessage = styled.div``;

const MessageContainer = styled.div`
padding:30px;
background-color: whitesmoke;
min-height: 90vh;
`;

const InputContainer = styled.form`
display:flex;
align-items: center;
position:sticky;
background-color:white;
bottom:0;
padding:10px;
z-index:100;
`;

const Input = styled.input`
outline:0;
flex:1;
border:none;
border-radius:10px;
padding:20px;
margin-left:15px;
margin-right:15px;
background-color:black;
font-size: large;
:hover{
    background-color:#808080;
}
`;

const Mybutton= styled.div`
color:black;
cursor: pointer;
border-radius: 2px;
:hover{
    color:gray;
}
`
