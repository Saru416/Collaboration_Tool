"use client";
import axios from "axios";
import React, { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import socket from "@/socket";
import RoomModal from "@/components/modals/RoomModal";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = React.useState("nothing");
  const [rooms, setRooms] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setloading] = React.useState(false);

  const handleCreateRoom = async (roomName: string) => {
    console.log("Creating room:", roomName);
    try {
      const res = await axios.post("/api/rooms", { name: roomName });
      console.log("Room Created: ", res);
      toast.success("Room created successfully");
    } catch (error: any) {
      console.error("Error Creating room:", error.message);
      toast.error("Failed to create room");
    }
  };
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("/api/rooms");
        console.log("Fetched Rooms:", res.data);
        setRooms(res.data); // If you want to store in state
      } catch (error: any) {
        console.error("Error fetching rooms:", error.message);
        toast.error("Failed to fetch rooms");
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/me");
        console.log(res.data);
        setData(res.data.user.username);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    getUserDetails();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket", socket.id);
      socket.emit("join-room", "room123");
    });

    socket.on("receive-message", (data: any) => {
      console.log("New message", data);
    });

    return () => {
      socket.off("connect");
      socket.off("receive-message");
    };
  }, []);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout success");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl text-white p-5">Dashboard</h1>
        <button
          onClick={logout}
          className="m-3 justify-items-end py-2 px-4 bg-white text-black rounded-xl hover:bg-gray-300 cursor-pointer"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 grid-rows-4">
        <div className="border-2 border-white p-5 rounded-2xl shadow-lg col-span-2 row-span-3 m-2 flex items-center justify-center">
          <div className="p-2 rounded-2xl shadow-lg flex flex-col justify-between w-full h-full">
            <h2 className="text-white text-xl mb-4">Your Rooms</h2>

            <div className="flex-1 overflow-y-auto space-y-2">
              {rooms.length === 0 ? (
                <span className="text-white text-xl flex items-center gap-2">
                  No rooms yet
                </span>
              ) : (
                rooms.map((room: any) => (
                  <div
                    key={room.id}
                    className="bg-white text-black p-3 rounded-xl shadow flex items-center justify-between"
                    onClick={() => router.push(`/room/${room.id}`)}
                  >
                    {room.name}
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer"
                      onClick={() => router.push(`/room/${room.id}`)}
                    >
                      Join Room
                    </button>{" "}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => setShowModal(true)}
              >
                ➕ Create New Room
              </button>
              {showModal && (
                <RoomModal
                  onClose={() => setShowModal(false)}
                  onCreate={handleCreateRoom}
                />
              )}
            </div>
          </div>
        </div>

        <div className="border-2 border-white p-10 rounded-2xl shadow-lg col-span-1 row-span-2 m-2">
          <div className="transform bg-white w-[99%] flex items-centex border-2 border-gray-400 rounded-xl text-black">
            <input
              type="text"
              placeholder="Search Room"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {/* Close "X" button */}
            {/* <button
                            className="ml-4 text-gray-500 hover:text-gray-800"
                        >
                            &#10005;
                        </button> */}
          </div>
        </div>
        <div className="border-2 border-white p-20 rounded-2xl shadow-lg col-span-1 row-span-2 m-2">
          <div
            className="border-2 border-white p-5 rounded-2xl shadow-lg col-span-1 row-span-2 m-2 flex items-center justify-center cursor-pointer hover:text-black transition"
            onClick={() => {
              socket.emit("send-message", {
                roomId: "room123",
                message: "Hello from dashboard!",
              });
              toast.success("Message sent to Room123!");
            }}
          >
            <span className="text-white text-xl text-center">{data}</span>
          </div>
        </div>
        <div className="border-2 border-white p-20 rounded-2xl shadow-lg col-span-2 m-2"></div>
      </div>
    </div>
  );
}
