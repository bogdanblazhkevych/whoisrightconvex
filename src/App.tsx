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
  const [sessionId, setSessionId] = useState<string>('');
  const [userType, setUserType] = useState<userType>('guest');

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
                setSessionId={setSessionId}/>
      </>
      }

      {chatRoomActive && 
        <>
          <About />
          <Chat chatData={chatData} userType={userType}/>
        </>
      }
    </div>
  );
}

export default App;
