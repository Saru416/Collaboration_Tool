// app/room/[id]/page.tsx or wherever you render the room
'use client'
import Chat from "../../chat/page";
import { useParams, useRouter } from "next/navigation";

export default function RoomPage() {

  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <div className="h-screen w-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Room: Collaboration Room</h2>
        <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg" onClick={() => router.push('/dashboard')}>
          Leave Room
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 grid-rows-6 gap-4 h-[90%]">
        {/* Whiteboard */}
        <div className="col-span-8 row-span-6 bg-white rounded-xl shadow-lg text-black p-4">
          <h3 className="text-lg font-semibold mb-2 ml-5">Tabs</h3>
          <div className="grid grid-cols-6 grid-rows-3 gap-4 h-[95%]">
            <div className="col-span-2 row-span-3 bg-green-300 rounded-xl shadow-lg text-black p-4 flex items-end justify-around">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 m-2 cursor-pointer">
                Create Document
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 m-2 cursor-pointer">
                Create WhiteBoard
              </button>
            </div>

            <div className="col-span-4 row-span-3 bg-blue-400 rounded-xl shadow-lg text-black p-4"></div>
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
            <li className="bg-gray-700 p-2 rounded">👤 User 1</li>
            <li className="bg-gray-700 p-2 rounded">👤 User 2</li>
            {/* Render dynamically */}
          </ul>
        </div>
      </div>
    </div>
  );
}
