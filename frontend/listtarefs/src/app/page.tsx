"use client";
import Button from "../components/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-slate-200 flex justify-center items-center min-h-screen px-2">
      <div className="flex justify-center items-center flex-col w-full max-w-xl">
        <h1 className="text-3xl sm:text-5xl mb-8 font-extrabold text-center">
          <strong>Bem vindo ao Organization</strong>
        </h1>
        <p className="font-medium text-base sm:text-xl mb-8 text-center">
          Organize as suas tarefas aqui, e tenha um dia mais organizado
        </p>
        <Button
          type="button"
          onClick={() => router.push("/login")}
          className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl transform active:scale-90 transition-transform duration-300 cursor-pointer mb-4 w-full sm:w-auto"
        >
          Entrar
        </Button>
        <button
          type="button"
          onClick={() => router.push("/createUser")}
          className="cursor-pointer bg-gray-300 hover:bg-gray-400 active:bg-gray-500 py-2 px-4 rounded-2xl transform active:scale-90 transition-transform duration-300 w-full sm:w-auto"
        >
          Cadastre-se
        </button>
      </div>
    </div>
  );
}
