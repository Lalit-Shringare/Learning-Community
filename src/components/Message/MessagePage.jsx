import './Message.css';
import { ProfileProvider } from './ProfileContext';
import MessageArea from './MessageArea';
import {MessageExp} from './MessageExp'


const MessagePage = () => {
 
  
  return (
    <ProfileProvider>
      <div className="top-parent">
        <MessageExp className="messageExp"/>
        <MessageArea className="messageArea"/>
      </div>
    </ProfileProvider>
      
    
  )
}

export default MessagePage;