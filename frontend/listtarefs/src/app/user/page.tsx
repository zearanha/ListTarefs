'use client'

import Button from '../../components/button'
import { useState } from 'react';
import api from '../../service/api';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';


export default function User(){
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] =useState('');
    const router = useRouter();

    const handleLogin = async(e: React.FormEvent) =>{
        e.preventDefault();
        setError('');
        setSuccess('');
        if(!email || !name || !password){
            setError('All fields are required');
            return;
        }
        try{
            const response = await api.post('/adU/login', {email, name, password});
            localStorage.setItem('token', response.data.token);
            setSuccess('Login successful');
            setEmail('');
            setName('');
            setPassword('');

            router.push('/user/tarefas')
        }
        catch(err){
            const error = err as AxiosError<{ message: string }>;
            if(error.response && error.response.data){
                setError(error.response.data.message);
            } else{
                setError('Erro ao conectar com o servidor');
            }
        }

    }
    return(
        <div className='m-0 p-0 box-border bg-slate-200 min-h-screen flex justify-center items-center'>
            <form onSubmit={handleLogin} className='flex justify-center items-center flex-col w-full rounded-2xl shadow-lg max-w-md p-8'>
                <h1 className='text-4xl font-bold mb-4'>Login</h1>
                <div>
                    <input className='bg-gray-300 outline-none border-none rounded-md p-2 mb-4 w-full' type="email" placeholder='Email' required value={email} onChange={e => setEmail(e.target.value)}/>
                    <input className='bg-gray-300 outline-none border-none rounded-md p-2 mb-4 w-full' type="text" placeholder='Name' required value={name} onChange={e => setName(e.target.value)}/>
                    <input className='bg-gray-300 outline-none border-none rounded-md p-2 mb-4 w-full' type="password" placeholder='Password' required value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                <Button type='submit'>Login</Button>
                {error && <div className='text-red-500 mt-2'>{error}</div>}
                {success && <div className='text-green-500 mt-2'>{success}</div>}
            </form>
        </div>
    )
}