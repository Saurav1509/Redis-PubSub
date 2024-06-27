import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [sendMessage, setSendMessage] = useState<string>("");
  // const [userId, setUserId] = useState<string>("");
  

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080');

    newSocket.onopen = () => {
      console.log('Connection Established');
      const newId = generateRandomString(5);
      setSocket(newSocket);
      newSocket.send(newId);
    }

    newSocket.onmessage = (message) => {
      console.log('Received a message: ', message.data);
      setMessages((m) => [...m, message.data]);
    }

  }, []);

  if(!socket){
    return <div>Loading ...</div>
  }

  return (
    <>
    <input placeholder='Send you message' onChange={(e) => {
      setSendMessage(e.target.value);
    }}></input>
      <button onClick={() => {
        socket.send(sendMessage);
      }}>Send Message</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </>
  )
}

function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default App
