import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

const App = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // console.log("render outside") ;

  useEffect(() => {
    //msg is the message that is sent by the server  ...

    socket.on("chat-message", (msg) => {
      console.log("message sent  ...");
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("user-joined", (notification) => {
      setNotifications((prevNotification) => [
        ...prevNotification,
        notification,
      ]);
    });

    socket.on("user-left", (notification) => {
      setNotifications((prevNotification) => [
        ...notification,
        prevNotification,
      ]);
    });

    return () => {
      socket.off("chat-message");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, []);

  const handleJoin = () => {
    if (username.trim()) {
      socket.emit("join", username);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      //send the message to the server ...
      socket.emit("chat-message", message);
      setMessage("");
    }
  };

  return (
    <div className="App">
      <h1> real time chat </h1>

      {/* handle the user joined */}

      <div>
        <input
          type="text"
          placeholder="enter the username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleJoin}> join chat </button>
      </div>

      {/* handle the notifications part ..  */}
      <div>
        <h2>Notification</h2>
        <ul>
          {notifications.map((notificaion, index) => {
            return <li key={index}> {notificaion} </li>;
          })}
        </ul>
      </div>

      {/* chat message . . */}

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
