// app/room/[id]/page.tsx or wherever you render the room
"use client";
import { useEffect, useState } from "react";
import Chat from "../../chat/page";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Editor from "@/components/editor";

interface RoomMember {
  id: string;
  userId: string;
  role: string;
}

interface Document {
  id: string;
  title: string;
}

export default function RoomPage() {
  const [users, setUsers] = useState<RoomMember[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const deleteRoom = async () => {
    try {
      const res = await axios.delete(`/api/rooms/${roomId}`);
      console.log("Room Deleted", res);
      router.push("/dashboard");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const res = await axios.get(`/api/rooms/${roomId}/documents`);
        setDocuments(res.data);
        console.log(res.data);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getDocuments();
  }, [roomId]);

  useEffect(() => {
    const getUserinRoom = async () => {
      try {
        const res = await axios.get(`/api/rooms/${roomId}/members`);
        setUsers(res.data);
        console.log(res.data);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getUserinRoom();
  }, [roomId]);

  return (
    <div className="h-screen w-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Room: Collaboration Room</h2>
        <div>
          <button
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg m-2"
            onClick={deleteRoom}
          >
            Delete Room
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg m-2"
            onClick={() => router.push("/dashboard")}
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 grid-rows-6 gap-4 h-[90%]">
        {/* Whiteboard */}
        <div className="col-span-8 row-span-6 bg-white rounded-xl shadow-lg text-black p-4">
          <h3 className="text-lg font-semibold mb-2 ml-5">Tabs</h3>
          <div className="grid grid-cols-6 grid-rows-3 gap-4 h-[95%]">
            <div className="col-span-2 row-span-3 bg-green-300 rounded-xl shadow-lg text-black p-4 flex flex-col justify-between">
              {/* Document Cards */}
              <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[80%]">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="bg-white p-4 rounded-xl shadow text-black flex flex-row justify-between items-center"
                  >
                    <h3 className="text-lg font-semibold">{document.title}</h3>
                    {/* You can add more details like a preview or a 'View' button */}
                    <div className="flex justify-end gap-2 mt-auto">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        // onClick={() =>
                        //   router.push(`/room/${roomId}/document/${document.id}`)
                        // }
                      >
                        Open
                      </button>
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                  Create Document
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                  Create WhiteBoard
                </button>
              </div>
            </div>

            <div className="col-span-4 row-span-3 bg-blue-400 rounded-xl shadow-lg text-black p-4">
              <Editor roomId={roomId} />
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="col-span-4 row-span-4 bg-gray-800 rounded-xl shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-2 ml-8">Chat</h3>
          {/* Chat component */}
          <Chat roomId={roomId} />
        </div>

        {/* Documents */}
        {/* <div className="col-span-8 row-span-2 bg-white rounded-xl shadow-lg text-black p-4">
          <h3 className="text-lg font-semibold mb-2">Documents</h3>
          Document viewer/editor here
          <button className=" bg-red-300 rounded-2xl px-3 py-5">
            Create New Document
          </button>
        </div> */}

        {/* Users/Collaborators List */}
        <div className="col-span-4 row-span-2 bg-gray-800 rounded-xl shadow-lg p-4 overflow-auto">
          <h3 className="text-lg font-semibold mb-2">Active Collaborators</h3>
          <ul className="space-y-2">
            {/* {users.map((member) => (
              <li key={member.id} className="text-white">
                {member.userId} — <i>{member.role}</i>
              </li>
            ))} */}
            <li className="bg-gray-700 p-2 rounded">👤 User 1</li>
            <li className="bg-gray-700 p-2 rounded">👤 User 2</li>
            {/* Render dynamically */}
          </ul>
        </div>
      </div>
    </div>
  );
}
