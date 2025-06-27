"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../service/api";
import { AxiosError } from "axios";

export default function User() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !name || !password) {
      setError("All fields are required");
      return;
    }
    try {
      const response = await api.post("/adU/login", { email, name, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setSuccess("Login successful");
      setEmail("");
      setName("");
      setPassword("");

      const userType = response.data.user.type;
      if (userType === "ADMIN") {
        router.push("/admin");
        return;
      } else if (userType === "USER") {
        router.push("/login/tarefas");
        return;
      } else {
        setError("Tipo de usuário desconhecido");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Erro ao conectar com o servidor");
      }
    }
  };

  return (
    <div className="m-0 p-0 box-border bg-slate-200 min-h-screen flex justify-center items-center px-2">
      <form
        onSubmit={handleLogin}
        className="flex justify-center items-center flex-col w-full rounded-2xl shadow-lg max-w-md p-4 sm:p-8"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 px-4 py-2 rounded-2xl border border-gray-300 outline-none w-full"
          required
        />
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 px-4 py-2 rounded-2xl border border-gray-300 outline-none w-full"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 px-4 py-2 rounded-2xl border border-gray-300 outline-none w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-2xl font-bold hover:bg-blue-700 transition w-full cursor-pointer"
        >
          Entrar
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
}