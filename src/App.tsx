import { useQuery } from 'convex/react';
import {useState} from 'react';
import './App.css';
import { api } from "./convex/_generated/api"
import About from './modules/about/about';
import Chat from './modules/chat/chat';
// import About from './modules/about/about';
// import Chat from './modules/chat/chat';
import Join from './modules/join/join';

interface ChatDataInterface {
  sessionId: string,
  host: {
    displayName: string,
    userId: string
  }
  guest: {
    displayName: string,
    userId: string
  }
}

type userType = "guest" | "host"
 
function App() {
  // const [currentDisplay, setCurrentDisplay] = useState('find-session');
  const [userType, setUserType] = useState<userType>('guest');
  
  const [sessionId, setSessionId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const chatRoomActive = useQuery(api.room.monitorRoom, {sessionId: sessionId})

  const [chatData, setChatData] = useState<ChatDataInterface>({
    sessionId: '',
    host: {
      displayName: '',
      userId: ''
    },
    guest: {
      displayName: '',
      userId: ''
    }
  })

  return (
    <div className="App">
      {!chatRoomActive && 
      <>
          <Join chatData={chatData} 
                setChatData={setChatData} 
                setUserType={setUserType}
                sessionId={sessionId}
                setSessionId={setSessionId}
                displayName={displayName}
                setDisplayName={setDisplayName}
                userId={userId}
                setUserId={setUserId}/>
      </>
      }

      {chatRoomActive && 
        <>
          <About />
          <Chat chatData={chatData} 
                userType={userType}
                sessionId={sessionId}
                displayName={displayName}
                userId={userId}/>
        </>
      }
    </div>
  );
}

export default App;
