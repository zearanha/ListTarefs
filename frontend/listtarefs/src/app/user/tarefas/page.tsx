'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

export default function Tarefs(){
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token){
            router.push('/user')
        } else {
            setAuthorized(true);
        }
    }, [router])

    if(!authorized) return null;

    return(
        <> <h1>Hello</h1></>
    )
}