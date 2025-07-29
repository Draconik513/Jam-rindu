import { useEffect, useState } from 'react';
import { db, ref, onValue, off } from '../firebase';
import { users } from '../data/users';

export default function MessageList({ currentUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    
    const handleData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        setMessages(messageList);
      }
    };

    onValue(messagesRef, handleData);

    return () => off(messagesRef, 'value', handleData);
  }, []);

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto p-2">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500 py-4">Belum ada pesan</p>
      ) : (
        messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-4 rounded-lg max-w-xs ${
              msg.senderId === currentUser 
                ? `${users[currentUser].bgColor} ml-auto` 
                : `${users[currentUser === 'abi' ? 'tiwi' : 'abi'].bgColor} mr-auto`
            }`}
          >
            <div className="flex justify-between items-start">
              <p className={`font-bold ${users[msg.senderId === currentUser ? currentUser : currentUser === 'abi' ? 'tiwi' : 'abi'].textColor}`}>
                {msg.sender}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            {msg.text && <p className="mt-1">{msg.text}</p>}
            
            {msg.media && (
              <div className="mt-3">
                {msg.mediaType === 'image' ? (
                  <img 
                    src={msg.media} 
                    alt="Pesan cinta" 
                    className="max-h-60 w-full rounded-lg object-contain"
                  />
                ) : (
                  <video 
                    src={msg.media} 
                    controls 
                    className="max-h-60 w-full rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}