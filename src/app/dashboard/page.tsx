'use client'
import axios from "axios";
import React, {useEffect} from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import socket from "@/socket";

export default function Dashboard() {
    const router = useRouter();
    const [data, setData] = React.useState("nothing");

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
            await axios.get('/api/users/logout');
            toast.success('Logout success');
            router.push('/login')
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/me')
            console.log(res.data);
            setData(res.data.user._id);
        } catch (error: any) {
            console.log(error.message);
        }
    }

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-2xl text-white p-5">Dashboard</h1>
                <button onClick={logout} className="m-3 justify-items-end py-2 px-4 bg-white text-black rounded-xl hover:bg-gray-300 cursor-pointer">Logout</button>
            </div>
            <div className="grid grid-cols-3 gap-4 grid-rows-4">
                <div className="border-2 border-white p-5 rounded-2xl shadow-lg col-span-2 row-span-3 m-2 flex items-center justify-center">
                    <span className="text-white text-xl flex items-center gap-2 cursor-pointer">
                        <span className="text-3xl">➕</span>
                        Create New Room
                    </span>
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
                    <span className="text-white text-xl text-center">
                        Room 123<br />
                        <span className="text-sm">Click to send a message</span>
                    </span>
                </div>
                </div>
                <div className="border-2 border-white p-20 rounded-2xl shadow-lg col-span-2 m-2"></div>
            </div>
        </div>
    );
}
