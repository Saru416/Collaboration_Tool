"use client"
import Link from "next/link";
import React, { useEffect } from "react"
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Signup(){
    const router = useRouter();
    const [user,setUser] = React.useState({
        username: "",
        email: "",
        password: ""
    });

    const [buttonDisabled, setbuttonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if(user.email.length > 0 && user.password.length >0 && user.username.length > 0){
            setbuttonDisabled(false);
        }else{
            setbuttonDisabled(true);
        }
    }, [user])

    const OnSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/users/signup',user);
            console.log("Logged in ", response);
            router.push('/dashboard');
        } catch (error: any) {
            console.log("Login failed", error.message);
            toast.error(error.message);
        } finally{
            setLoading(false);
        }
    }
    return(
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h2 className="mt-40 text-2xl">SignUp</h2>
            <div className="flex flex-col">
                <label>UserName: </label>
                <input className="bg-white p-2 border-gray-400 border-2 rounded-xl text-black" 
                        type="text" 
                        placeholder="username" 
                        value={user.username} 
                        onChange={(e) => setUser({...user, username: e.target.value})}/>
                <label>Email: </label>
                <input className="bg-white p-2 border-gray-400 border-2 rounded-xl text-black" 
                        type="text" 
                        placeholder="email" 
                        value={user.email} 
                        onChange={(e) => setUser({...user, email: e.target.value})}/>
                <label>Password: </label>
                <input className="bg-white p-2 border-gray-400 border-2 rounded-xl text-black" 
                        type="password" 
                        placeholder="password" 
                        value={user.password} 
                        onChange={(e) => setUser({...user, password: e.target.value})}/>
                <button className="p-2 bg-blue-500 mt-5 rounded-2xl cursor-pointer" onClick={OnSignup}>Sign Up</button>
                <span className="mt-2">Already have an account? <Link href="/login">Login</Link></span>
            </div>
        </div>
    )
}