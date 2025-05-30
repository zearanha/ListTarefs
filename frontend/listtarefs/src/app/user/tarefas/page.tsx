'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type JwtPayLoad = {
    exp: number;
}

export default function Tarefs(){
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        // Check if the token exists
        if(!token){
            router.push('/user')
            return;
        } 

        try{
            const decoded = jwtDecode<JwtPayLoad>(token);
            const now = Date.now() / 1000;
            if(decoded.exp < now){
                localStorage.removeItem('token');
                router.push('/user');
                return;
            }
            else{
                setAuthorized(true);
                const msToExpire = (decoded.exp - now) * 1000;
                const timeout = setTimeout(() => {
                    localStorage.removeItem('token');
                    router.push('/user');
                }, msToExpire)
                return () => clearTimeout(timeout);
            }
        }
        catch{
            localStorage.removeItem('token');
            router.push('/user')
        }
    }, [router])

    if(!authorized) return null;

    return(
        <> <h1>Acesso permitido</h1></>
    )
}