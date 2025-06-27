"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import api from "../../../service/api";
import { data } from "react-router-dom";

type JwtPayLoad = {
  exp: number;
};

export default function Tarefs() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // model de user, mostrando o nome na tela
  const [userName, setUserName] = useState<string | null>(null);

  // Estado para armazenar as tarefas
  const [tarefas, setTarefas] = useState<any[]>([]);

  // Adicionando uma tarefa
  const [showForm, setShowForm] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({
    tarefa: "",
    dataInicio: "",
    dataFim: "",
  });

  // Modal de edição de tarefas
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarefa, setEditTarefa] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // Verifica se o token é válido e se não expirou
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayLoad>(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      } else {
        setAuthorized(true);
        const msToExpire = (decoded.exp - now) * 1000;
        const timeout = setTimeout(() => {
          localStorage.removeItem("token");
          router.push("/login");
        }, msToExpire);
        return () => clearTimeout(timeout);
      }
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  // Busca o nome do usuário do localStorage e exibe na tela
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name);
    }
  }, []);

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const user = localStorage.getItem("user");
        if (!user) return setTarefas([]);
        const userData = JSON.parse(user);
        const response = await api.get(`/ltf/listTarefs/user/${userData.id}`);
        setTarefas(response.data);
      } catch (error) {
        setTarefas([]);
      }
    };
    if (authorized) {
      fetchTarefas();
    }
  }, [authorized]);

  if (!authorized) return null;

  // Função para adicionar uma tarefa
  const newTaref = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    if (!user) return;
    const userData = JSON.parse(user);

    try {
      await api.post("/ltf/listTarefs", {
        ...novaTarefa,
        dataInicio: new Date(novaTarefa.dataInicio),
        dataFim: new Date(novaTarefa.dataFim),
        userId: userData.id,
      });
      setNovaTarefa({ tarefa: "", dataInicio: "", dataFim: "" });
      setShowForm(false); // Atualiza a lista após adicionar uma tarefa
      const response = await api.get(`/ltf/listTarefs/user/${userData.id}`);
      setTarefas(response.data);
    } catch (err) {
      alert("Erro ao adicionar tarefa");
    }
  };

  // Editar tarefa

  const edit = (tarefa: any) => {
    setEditTarefa({ ...tarefa });
    setShowEditModal(true);
    setMensagem("");
  };

  const atualizarTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarefa) return;
    setLoading(true);
    setMensagem("");
    try {
      await api.put(`/ltf/listTarefs/${editTarefa._id}`, {
        tarefa: editTarefa.tarefa,
        dataInicio: editTarefa.dataInicio,
        dataFim: editTarefa.dataFim,
        userId: editTarefa.userId,
      });
      setMensagem("Tarefa atualizada com sucesso!");
      setShowEditModal(false);
      // Atualiza lista
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        const response = await api.get(`/ltf/listTarefs/user/${userData.id}`);
        setTarefas(response.data);
      }
    } catch (err) {
      setMensagem("Erro ao atualizar tarefa");
    } finally {
      setLoading(false);
    }
  };

  // Deletar Tarefa

  const deleteTaref = async (tarefa: any) => {
    if (confirm("tem certeza que deseja excluir esta tarefa?")) {
      try {
        await api.delete(`/ltf/listTarefs/${tarefa._id}`, {
          data: { userId: tarefa.userId },
        });
        setTarefas(tarefas.filter((t) => t._id !== tarefa._id));
      } catch (err) {
        alert("Erro ao excluir");
      }
    }
  };

  // Sair do login
  const exitLogin = () => {
    localStorage.clear();
    router.push("/");
  };

  //
  return (
    <div className="m-0 p-0 box-border bg-slate-200 min-h-screen flex flex-col items-center justify-start">
      <div className="w-full flex flex-col items-center mt-10">
        <h1 className="text-4xl font-extrabold mb-2 text-center">
          Lista de Tarefas
        </h1>
        {userName && (
          <p className="text-lg font-semibold mb-6 text-center">
            Bem-vindo, <span className="text-blue-600">{userName}</span>
          </p>
        )}
        <nav className="flex gap-4 mb-8">
          <button
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded-4xl transition-transform duration-300"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancelar" : "Adicionar tarefa"}
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded-4xl transition-transform duration-300"
            onClick={exitLogin}
          >
            Sair
          </button>
        </nav>
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
          {showForm && (
            <form onSubmit={newTaref} className="flex flex-col gap-4 mb-6">
              <input
                type="text"
                placeholder="Tarefa"
                value={novaTarefa.tarefa}
                onChange={(e) =>
                  setNovaTarefa({ ...novaTarefa, tarefa: e.target.value })
                }
                required
                className="bg-gray-200 px-4 py-2 rounded-4xl outline-none"
              />
              <input
                type="date"
                value={novaTarefa.dataInicio}
                onChange={(e) =>
                  setNovaTarefa({ ...novaTarefa, dataInicio: e.target.value })
                }
                required
                className="bg-gray-200 px-4 py-2 rounded-4xl outline-none"
              />
              <input
                type="date"
                value={novaTarefa.dataFim}
                onChange={(e) =>
                  setNovaTarefa({ ...novaTarefa, dataFim: e.target.value })
                }
                required
                className="bg-gray-200 px-4 py-2 rounded-4xl outline-none"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-4xl font-bold hover:bg-green-700 transition"
              >
                Salvar
              </button>
            </form>
          )}
          {tarefas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="py-2 px-4">Tarefa</th>
                    <th className="py-2 px-4">Data Início</th>
                    <th className="py-2 px-4">Data Fim</th>
                    <th className="py-2 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tarefas.map((tarefa) => (
                    <tr key={tarefa._id} className="border-t">
                      <td className="py-2 px-4">{tarefa.tarefa}</td>
                      <td className="py-2 px-4">
                        {new Date(tarefa.dataInicio).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">
                        {new Date(tarefa.dataFim).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded-4xl hover:bg-blue-600 transition"
                          onClick={() => edit(tarefa)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-4xl hover:bg-red-600 transition"
                          onClick={() => deleteTaref(tarefa)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              Nenhuma tarefa cadastrada.
            </p>
          )}
        </div>
        {showEditModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative flex flex-col items-center">
            <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-gray-700"
                aria-label="Fechar"
            >
                ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
                Editar Tarefa
            </h2>
            <form onSubmit={atualizarTarefa} className="flex flex-col gap-4 w-full">
                <input
                    type="text"
                    value={editTarefa?.tarefa || ""}
                    onChange={e => setEditTarefa({ ...editTarefa, tarefa: e.target.value })}
                    required
                    className="bg-gray-200 px-4 py-2 rounded-4xl outline-none"
                />
                <input
                    type="date"
                    value={editTarefa?.dataInicio?.slice(0,10) || ""}
                    onChange={e => setEditTarefa({ ...editTarefa, dataInicio: e.target.value })}
                    required
                    className="bg-gray-200 px-4 py-2 rounded-4xl outline-none"
                />
                <input
                    type="date"
                    value={editTarefa?.dataFim?.slice(0,10) || ""}
                    onChange={e => setEditTarefa({ ...editTarefa, dataFim: e.target.value })}
                    required
                    className="bg-gray-200 px-4 py-2 rounded-4xl outline-none"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-4xl font-bold hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </form>
            {mensagem && <p className="mt-4 text-center">{mensagem}</p>}
        </div>
    </div>
)}
      </div>
    </div>
  );
}
