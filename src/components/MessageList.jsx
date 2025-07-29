import { useEffect, useState } from 'react';
import { users } from '../data/users';

export default function MessageList({ messages, currentUser }) {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto p-2">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500 py-4">Belum ada pesan</p>
      ) : (
        messages.map((msg) => (
          <div 
            key={msg.timestamp} 
            className={`p-4 rounded-lg max-w-xs ${
              msg.senderId === currentUser 
                ? `${users[currentUser].bgColor || 'bg-pink-100'} ml-auto` 
                : `${users[currentUser === 'abi' ? 'tiwi' : 'abi'].bgColor || 'bg-gray-100'} mr-auto`
            }`}
          >
            <div className="flex justify-between items-start">
              <p className={`font-bold ${users[msg.senderId === currentUser ? currentUser : currentUser === 'abi' ? 'tiwi' : 'abi'].textColor || 'text-pink-600'}`}>
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