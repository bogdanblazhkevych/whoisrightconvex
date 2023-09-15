import { useQuery } from 'convex/react';
import { useState } from 'react';
import './App.css';
import { api } from "./convex/_generated/api"
import About from './modules/about/about';
import Chat from './modules/chat/chat';
import Join from './modules/join/join';

export interface UserDataInterface {
  sessionId: string;
  displayName: string;
  userId: string;
}
 
function App() {
  const [userData, setUserData] = useState<UserDataInterface>({
    sessionId: '',
    displayName: '',
    userId: ''
  })
  
  const getChatRoomUserCount = useQuery(api.room.getChatRoomUserCount, {sessionId: userData.sessionId}) ?? 0

  return (
    <div className="App">
      {getChatRoomUserCount !== 2 && 
      <>
          <Join userData={userData}
                setUserData={setUserData}/>
      </>
      }

      {getChatRoomUserCount === 2 && 
        <>
          <About />
          <Chat userData={userData}/>
        </>
      }
    </div>
  );
}

export default App;
