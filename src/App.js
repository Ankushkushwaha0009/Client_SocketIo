import React, { useEffect, useState } from "react" ;
import io from "socket.io-client" ;
const socket = io("http://localhost:5000");

const App = () => {
  
  const [message, setMessage]   = useState("");
  const [messages, setMessages] = useState([]);

  console.log("render outside") ; 

  useEffect(() => {
    //msg is the message that is sent by the server  ... 
    socket.on("chat-message", (msg) => {
      console.log("message sent  ...") ; 
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => {
      socket.off("chat-message");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      //send the message to the server ... 
      socket.emit('chat-message', message);  
      setMessage('');
    }
  };

  return (
    <div className="App">
      <h1> real time chat </h1>
      <ul>
        {messages.map((msg, index) => {
          return <li key={index}> {msg} </li>;
        })}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit"> Submit </button>
      </form>
    </div>
  );
};

export default App;
