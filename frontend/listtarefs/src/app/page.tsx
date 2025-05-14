'use client'

import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
  
    <div className="bg-slate-200 flex justify-center items-center h-screen ">
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-5xl mb-8 font-extrabold"><strong>Bem vindo ao Organization</strong></h1>
        <p className="font-medium text-xl mb-8">
          Organize as suas tarefas aqui, e tenha um dia mais organizado
        </p>
        <button type="button" onClick={() => router.push('/user')} className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded-4xl transform active:scale-90 transition-transform duration-300 cursor-pointer mb-4">Entrar</button>

        <button type="button" onClick={() => router.push('/createUser')} className="cursor-pointer bg-gray-300 hover:bg-gray-400 active:bg-gray-500 py-2 px-4 rounded-4xl ">Cadastre-se</button>
        
      </div>
    </div>
  );
}
