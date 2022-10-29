import styled from "styled-components";
import { auth } from "../firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import moment from "moment";

function Message({user, message}) {
  const [userLoggeddIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggeddIn.email ? Sender : Reciver;


  return (
    <Container>
        <TypeOfMessage>
          {message.message}
          <Timestamp>
          {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
          </Timestamp> 
          </TypeOfMessage>
    </Container>
  )
}

export default Message

const Container =styled.div``

const MessageElement = styled.p`
width: fit-content;
padding:15px;
border-radius: 10px;
margin:10px;
min-width: 60px;
padding-bottom: 26px;
position: relative;
text-align:right;
`;

const Sender = styled(MessageElement)`
margin-left:auto;
background-color:#454B1B;
`

const Reciver = styled(MessageElement)`
background-color:#023020;
text-align:left;
`

const Timestamp = styled.div`
padding: 10px;
font-size:9px;
position:absolute;
bottom:0;
text-align:right;
right:0;
`