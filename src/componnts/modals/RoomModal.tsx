'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function RoomModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (roomName: string) => void;
}) {
  const [roomName, setRoomName] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create a Room</h2>
        <input
          type="text"
          placeholder="Enter room name"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none text-black"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
          onClick={() => {
            onCreate(roomName);
            onClose();
          }}
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
