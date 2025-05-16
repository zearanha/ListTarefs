'use client'

import axios, { AxiosError} from 'axios'
import Button from '../../components/button'
import api from '../../service/api'
import { useRef } from 'react'
import { useState } from 'react'


interface HTMLInputElements{
    name: HTMLInputElement | null,
    email: HTMLInputElement | null,
    password: HTMLInputElement | null
}

export default function CreateUser(){


    const inputNameRef = useRef<HTMLInputElement>(null);
    const inputEmailRef = useRef<HTMLInputElement>(null);
    const inputPasswordRef = useRef<HTMLInputElement>(null);
    const [ menssagem, setMensagem ] = useState<string>('');


    const isAxiosError = (error: unknown): error is AxiosError => {
        return axios.isAxiosError(error)
    }

    const registerNewuser = async () =>{
        try{
            const response = await api.post('/adU/user', {
                name: inputNameRef.current?.value,
                email: inputEmailRef.current?.value,
                password: inputPasswordRef.current?.value
            })
            
            if(response.status === 201){
                const inputs: HTMLInputElements = {
                    name: inputNameRef.current,
                    email: inputEmailRef.current,
                    password: inputPasswordRef.current,
                }

                for (const key in inputs){
                    const input = inputs[key as keyof HTMLInputElements]
                    if(input){
                        input.value = '';
                    }
                    
                }
                setMensagem('Usuário cadastrado com sucesso!')
            }
            else{
                setMensagem(`Erro ao cadastrar usuário: ${ response.data?.message || 'Erro desconhecido'}`)
            }

            console.log(response)
        }
        catch (error: unknown) {
            if (isAxiosError(error)) {
                setMensagem(`Erro ao registrar utilizador: ${error.response?.data || error.message || 'Erro desconhecido'}`);
                console.error("Erro ao registrar utilizador", error);
            } else {
                setMensagem('Erro ao registrar utilizador: erro desconhecido');
                console.error("Erro ao registrar utilizador", error);
            }
        }
    }


    return(
        <div className="m-0 p-0 box-border bg-slate-200 min-h-screen flex justify-center items-center">
            <div className="flex justify-center items-center flex-col w-full rounded-2xl shadow-lg max-w-md p-8">
                <div className="flex justify-center items-center">
                    <h2 className="text-4xl font-bold mb-4">Cadastre-se</h2>
                </div>
                <div className="flex flex-col justify-center items-center gap-y-3 mb-5">
                    <input ref={inputNameRef} className="bg-gray-300 px-4 py-1 rounded-4xl outline-none" type="text" placeholder="name" />
                    <input ref={inputEmailRef} className="bg-gray-300 px-4 py-1 rounded-4xl outline-none" type="email" placeholder="email"/>
                    <input ref={inputPasswordRef} className="bg-gray-300 px-4 py-1 rounded-4xl outline-none" type="password" placeholder="password"/>
                </div>
                {menssagem && <p className='mb-4 text-center'>{menssagem}</p>}
                <div>
                    <Button onClick={registerNewuser}>Cadastrar</Button>
                </div>
            </div>
        </div>
    )
}