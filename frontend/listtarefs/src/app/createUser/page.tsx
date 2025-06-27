"use client";
import React, { useRef, useState } from "react";
import api from "../../service/api";
import axios, { AxiosError } from "axios";

interface HTMLInputElements {
  name: HTMLInputElement | null;
  email: HTMLInputElement | null;
  password: HTMLInputElement | null;
}

export default function CreateUser() {
  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const [mensagem, setMensagem] = useState<string>("");

  const isAxiosError = (error: unknown): error is AxiosError => {
    return axios.isAxiosError(error);
  };

  const registerNewuser = async () => {
    try {
      const response = await api.post("/adU/user", {
        name: inputNameRef.current?.value,
        email: inputEmailRef.current?.value,
        password: inputPasswordRef.current?.value,
        type: "USER",
      });

      if (response.status === 201) {
        const inputs: HTMLInputElements = {
          name: inputNameRef.current,
          email: inputEmailRef.current,
          password: inputPasswordRef.current,
        };

        (Object.keys(inputs) as Array<keyof HTMLInputElements>).forEach(
          (key) => {
            const input = inputs[key];
            if (input) input.value = "";
          }
        );
        setMensagem("Usuário cadastrado com sucesso!");
      } else {
        setMensagem(
          `Erro ao cadastrar usuário: ${
            response.data?.message || "Erro desconhecido"
          }`
        );
      }
    } catch (error: unknown) {
        if (isAxiosError(error)) {
          const apiMessage =
            error.response?.data &&
            typeof (error.response.data as { message?: unknown }).message === "string"
              ? (error.response.data as { message: string }).message
              : error.message;
          setMensagem(
            `Erro ao registrar utilizador: ${apiMessage || "Erro desconhecido"}`
          );
        } else {
          setMensagem("Erro ao registrar utilizador: erro desconhecido");
        }
    }
  };

  return (
    <div className="m-0 p-0 box-border bg-slate-200 min-h-screen flex justify-center items-center px-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          registerNewuser();
        }}
        className="flex flex-col w-full max-w-md bg-white rounded-2xl shadow-lg p-4 sm:p-8"
      >
        <h1 className="text-2xl font-bold mb-4">Criar Usuário</h1>
        <input
          type="text"
          placeholder="Nome"
          ref={inputNameRef}
          className="mb-2 px-4 py-2 rounded-2xl border border-gray-300 outline-none"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          ref={inputEmailRef}
          className="mb-2 px-4 py-2 rounded-2xl border border-gray-300 outline-none"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          ref={inputPasswordRef}
          className="mb-2 px-4 py-2 rounded-2xl border border-gray-300 outline-none"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-2xl font-bold hover:bg-green-700 transition"
        >
          Cadastrar
        </button>
        {mensagem && <p className="mt-2 text-center">{mensagem}</p>}
      </form>
    </div>
  );
}
