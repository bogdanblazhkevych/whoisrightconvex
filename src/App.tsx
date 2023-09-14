import { useQuery } from 'convex/react';
import { useState } from 'react';
import './App.css';
import { api } from "./convex/_generated/api"
import About from './modules/about/about';
import Chat from './modules/chat/chat';
import Join from './modules/join/join';

export interface TestChatRoomDataInterface {
  userType: "guest" | "host" | '';
  sessionId: string;
  displayName: string;
  userId: string;
}
 
function App() {
  const [testChatRoomData, setTestChatRoomData] = useState<TestChatRoomDataInterface>({
    userType: '',
    sessionId: '',
    displayName: '',
    userId: ''
  })
  
  const getChatRoomUserCount = useQuery(api.room.getChatRoomUserCount, {sessionId: testChatRoomData.sessionId}) ?? 0

  return (
    <div className="App">
      {getChatRoomUserCount !== 2 && 
      <>
          <Join testChatRoomData={testChatRoomData}
                setTestChatRoomData={setTestChatRoomData}/>
      </>
      }

      {getChatRoomUserCount === 2 && 
        <>
          <About />
          <Chat testChatRoomData={testChatRoomData}/>
        </>
      }
    </div>
  );
}

export default App;
