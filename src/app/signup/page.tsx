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
        <div className="flex items-center justify-center min-h-screen p-8">
            <div className="border-2 border-dotted border-white p-20 rounded-2xl shadow-lg">
                <h2 className="text-2xl text-center mb-2">WELCOME!</h2>
                <p className="text-center mb-8">Sign up to continue...</p>
                <div className="flex flex-col">
                    <div className="flex m-2">
                        <label className="mr-5">Username</label>
                        <input className="bg-white p-2 border-gray-400 border-2 rounded-xl text-black" 
                                type="text" 
                                placeholder="username" 
                                value={user.username} 
                                onChange={(e) => setUser({...user, username: e.target.value})}/>
                    </div>
                    <div className="flex m-2">
                        <label className="mr-13">Email</label>
                        <input className="bg-white p-2 border-gray-400 border-2 rounded-xl text-black" 
                                type="text" 
                                placeholder="email" 
                                value={user.email} 
                                onChange={(e) => setUser({...user, email: e.target.value})}/>
                    </div>
                    <div className="flex m-2">
                        <label className="mr-5">Password</label>
                        <input className="bg-white p-2 border-gray-400 border-2 rounded-xl text-black" 
                            type="password" 
                            placeholder="password" 
                            value={user.password} 
                            onChange={(e) => setUser({...user, password: e.target.value})}/>

                    </div>
                    
                    <button className="p-2 bg-white text-black mt-5 rounded-2xl cursor-pointer hover:bg-gray-200" onClick={OnSignup}>Sign Up</button>
                    <span className="mt-4 text-center">Already have an account? <Link href="/login">Login</Link></span>
                </div>
            </div>
        </div>
    )
}
