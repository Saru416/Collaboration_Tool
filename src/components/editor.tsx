'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function Editor({ roomId }: { roomId: string }) {
  const editorRef = useRef<EditorJS | null>(null);
  const params = useParams();

  const handleSave = async () => {
    try {
      const savedData = await editorRef.current?.save();

      const res = await axios.post(`/api/rooms/${roomId}/documents`, {
        title: 'My New Doc',
        content: savedData,
      });

      console.log('Document saved:', res.data);
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  };

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          list: List,
        },
        autofocus: true,
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Welcome to Editor.js in Next.js!',
              },
            },
          ],
        },
        onReady: () => {
          console.log('Editor.js is ready!');
        },
      });
    }

    return () => {
      (async () => {
        if (editorRef.current && typeof editorRef.current.destroy === 'function') {
          await editorRef.current.destroy();
          editorRef.current = null;
        }
      })();
    };
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div id="editorjs" className="border rounded-lg p-4 bg-white min-h-[300px]" />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Document
      </button>
    </div>
  );
}
