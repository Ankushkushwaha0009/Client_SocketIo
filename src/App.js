// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";
// const socket = io("http://localhost:5000");

// const App = () => {

//   const [username, setUsername] = useState("");
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [notifications, setNotifications] = useState([]);

//   // console.log("render outside") ;

//   useEffect(() => {
//     //msg is the message that is sent by the server  ...

//     socket.on("chat-message", (msg) => {
//       console.log("message sent  ...");
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     socket.on("user-joined", (notification) => {
//       setNotifications((prevNotification) => [
//         ...prevNotification,
//         notification,
//       ]);
//     });

//     socket.on("user-left", (notification) => {
//       setNotifications((prevNotification) => [
//         ...notification,
//         prevNotification,
//       ]);
//     });

//     return () => {
//       socket.off("chat-message");
//       socket.off("user-joined");
//       socket.off("user-left");
//     };
//   }, []);

//   const handleJoin = () => {
//     if (username.trim()) {
//       socket.emit("join", username);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       //send the message to the server ...
//       socket.emit("chat-message", message);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="App">
//       <h1> real time chat </h1>

//       {/* handle the user joined */}

//       <div>
//         <input
//           type="text"
//           placeholder="enter the username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <button onClick={handleJoin}> join chat </button>
//       </div>

//       {/* handle the notifications part ..  */}
//       <div>
//         <h2>Notification</h2>
//         <ul>
//           {notifications.map((notificaion, index) => {
//             return <li key={index}> {notificaion} </li>;
//           })}
//         </ul>
//       </div>

//       {/* chat message . . */}

//       <ul>
//         {messages.map((msg, index) => {
//           return <li key={index}> {msg} </li>;
//         })}
//       </ul>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message"
//         />
//         <button type="submit"> Submit </button>
//       </form>
//     </div>
//   );
// };

// export default App;

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

const App = () => {

  const [username, setUsername] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("private-message", ({ from, message }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender : from, text: message },
      ]);
    });

    return () => {
      socket.off("private-message");
    };
  });

  const handleRegister = () => {
    if (username.trim()) {
      socket.emit("register", username);
      console.log("Registered as : ", username);
    }
  };

  const handleSendMessage = () => {
    if (recipient.trim() && message.trim()) {
      socket.emit("private-message", { to : recipient, message });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "you", text: message },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="App">
      <div>
        <input
          type="text"
          placeholder="Enter the username .. "
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleRegister}> Register </button>
      </div>

      <div>

        <input
          type="text"
          placeholder="Recipient username"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}> Send Message </button>
      </div>

      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong> {msg.sender}:</strong> {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
