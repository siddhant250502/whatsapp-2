import styled from "styled-components"
import {Avatar,IconButton,Button} from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from "email-validator"
import {auth,db} from "../firebase"
import {useAuthState} from "react-firebase-hooks/auth"
import {useCollection} from "react-firebase-hooks/firestore";
import { DockSharp } from "@mui/icons-material";
import Chat from "./Chat";

function Sidebar() {
    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users','array-contains',user.email)

    const [chatsSnapshot] = useCollection(userChatRef);
    const createChat = () => {
        const input=prompt(
            "Please enter your email address"
            );
        if(!input) return null;

        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            db.collection('chats').add({
                users: [user.email, input],
            });
        }
    };

    const chatAlreadyExists = (recipientEmail) => 
        !!chatsSnapshot?.docs.find( 
            (chat) => 
                chat.data().users.find((user) => user === recipientEmail)?.lenght>0
        );
    

  return (
    <Container>
        <Header>
            <UserAvatar src={user.photoURL} onClick={()=>auth.signOut()}/>
            <IconsContainer>
                <IconButton>
                <ChatIcon/>
                </IconButton>
                <IconButton>
                <MoreVertIcon/>
                </IconButton>
            </IconsContainer>
        </Header>
        <Search>
            <SearchIcon color="success"/>
            <SearchInput/>
        </Search>
        <SidebarButton color="success"  onClick={createChat}>Start a new chat </SidebarButton>

        {chatsSnapshot?.docs.map(chat =>(
            <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
        ))}
    </Container>
  )
}

export default Sidebar;

const Container=styled.div`
flex:0.45;
border-right: 1px solid whitesmoke;
height:100vh;
min-width: 300px;
max-width:350px;
overflow-y:scroll;
::-webkit-scrollbar{
    display: none;
}
-ms-overflow-style: none;
scrollbar-width:none;
`;

const SidebarButton = styled(Button)`
width:100%;

&&&{
    border-top:1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;

}
`

const Header =styled.div`
display:flex;
position:sticky;
top:0;
background-color:white;
z-index:1;
justify-content:space-between;
align-items:center;
padding:15px;
height:80px;
border-bottom:1px solid whitesmoke;
`;

const UserAvatar =styled(Avatar)`
cursor: pointer;
:hover{
    opacity: 0.8;
}
`;

const IconsContainer = styled.div`
  display:flex;
`
const Search =styled.div`
display:flex;
align-items:center;
border-radius: 2px;
padding:20px;
background-color:white;
padding: 10px;
justify-content:space-between;
`


const SearchInput = styled.input`
  width:250px;
  border:none;
  border-radius: 10px;
  outline-width: 0;
  flex:1;
  background-color:black;
  :hover{
    background-color:#808080;
  }
  height:30px;
`
