'use client';
import React, { useEffect, useState } from 'react';
import socket from '@/socket';

export default function Chat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<{ from: string; message: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Join the room
    socket.emit('join-room', roomId);

    // Listen for incoming messages
    socket.on('receive-message', (data: { from: string; message: string }) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [roomId]);

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    // Emit to server
    //socket.emit('send-message', { roomId, message: newMessage });

    // Add to local state
    setMessages(prev => [...prev, { from: 'Me', message: newMessage }]);
    setNewMessage('');
  };

  return (
    <div className="p-4 border rounded-xl bg-white max-w-md mx-auto shadow-md">
      <div className="h-80 overflow-y-auto border p-2 mb-4 rounded-md bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.from === 'Me' ? 'text-right' : 'text-left'}`}
          >
            <span className={ `${msg.from === 'Me' ? 'bg-blue-500' : 'bg-white text-black'} inline-block px-3 py-1 rounded-lg`}>
              <strong>{msg.from}:</strong> {msg.message}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg text-black"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
