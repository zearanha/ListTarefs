"use client";

import api from "../../service/api";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type JwtPayLoad = {
  exp: number;
};

type User = {
  id: number;
  name: string;
  email: string;
  type: string;
};

export default function Admin() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userName, setUserName] = useState<string | null>(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Form refs
  const inputNameRef = useRef<HTMLInputElement>(null);
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);

  // Modal ADMIN

  const [showAdminModal, setShowAdminModal] = useState(false);
  const inputAdminNameRef = useRef<HTMLInputElement>(null);
  const inputAdminEmailRef = useRef<HTMLInputElement>(null);
  const inputAdminPasswordRef = useRef<HTMLInputElement>(null);
  const [adminMensagem, setAdminMensagem] = useState<string>("");
  const [adminLoading, setAdminLoading] = useState(false);

  //

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setUserName(userObj.name);
    }
  }, []);

  // Descomente se quiser proteger a rota com JWT

  useEffect(() => {
    const token = localStorage.getItem("token");
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

  useEffect(() => {
    // Se for usar proteção, troque para if (!authorized) return;
    const fetchUsers = async () => {
      try {
        const res = await api.get("/adU/users");
        setUsers(res.data.users);
      } catch (err) {
        setMensagem("Erro ao buscar usuários");
      }
    };
    fetchUsers();
  }, []);

  if (!authorized) return null;

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const handleEdit = async (id: number) => {
    setSelectedUserId(id);
    setShowModal(true);
    setMensagem("");
    setLoading(true);
    try {
      const res = await api.get(`/adU/adduser/${id}`);
      if (res.data.user) {
        if (inputNameRef.current)
          inputNameRef.current.value = res.data.user.name;
        if (inputEmailRef.current)
          inputEmailRef.current.value = res.data.user.email;
        if (inputPasswordRef.current) inputPasswordRef.current.value = "";
      }
    } catch (err) {
      setMensagem("Erro ao carregar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUserId(null);
    setMensagem("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setLoading(true);
    try {
      const userToEdit = users.find((u) => u.id === selectedUserId);
      const data: any = {
        name: inputNameRef.current?.value,
        email: inputEmailRef.current?.value,
        type: userToEdit?.type || "USER", // Preserva o tipo do usuário
      };
      if (inputPasswordRef.current?.value) {
        data.password = inputPasswordRef.current.value;
      }
      await api.put(`/adU/addUser/${selectedUserId}`, data);
      setMensagem("Usuário atualizado com sucesso!");
      setUsers(
        users.map((user) =>
          user.id === selectedUserId
            ? {
                ...user,
                name: inputNameRef.current?.value || "",
                email: inputEmailRef.current?.value || "",
              }
            : user
        )
      );
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (err) {
      setMensagem("Erro ao atualizar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/adU/addUser/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        setMensagem("Erro ao excluir usuário");
      }
    }
  };

  const handleOpenAdminModal = () => {
    setShowAdminModal(true);
    setAdminMensagem("");
    if (inputAdminNameRef.current) inputAdminNameRef.current.value = "";
    if (inputAdminEmailRef.current) inputAdminEmailRef.current.value = "";
    if (inputAdminPasswordRef.current) inputAdminPasswordRef.current.value = "";
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminMensagem("");
    try {
      await api.post("/adU/user", {
        name: inputAdminNameRef.current?.value,
        email: inputAdminEmailRef.current?.value,
        password: inputAdminPasswordRef.current?.value,
        type: "ADMIN", // já definido
      });
      setAdminMensagem("Administrador criado com sucesso!");
      setTimeout(() => {
        setShowAdminModal(false);
        setAdminMensagem("");
      }, 1000);
    } catch (err: any) {
      setAdminMensagem("Erro ao criar administrador.");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="m-0 p-0 box-border bg-slate-200 min-h-screen flex flex-col items-center justify-start">
      <div className="w-full flex flex-col items-center mt-6 sm:mt-10 px-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-center">
          Painel do Administrador
        </h1>
        {userName && (
          <p className="text-base sm:text-lg font-semibold mb-6 text-center">
            Bem-vindo, <span className="text-blue-600">{userName}</span>
          </p>
        )}
        <nav className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 sm:mb-8 w-full max-w-xs sm:max-w-none">
          <button
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl transition-transform duration-300 w-full sm:w-auto"
            onClick={() => router.push("/admin")}
          >
            Lista de Usuários
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded-2xl transition-transform duration-300 w-full sm:w-auto"
            onClick={() => router.push("/createUser")}
          >
            Adicionar Usuário
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl transition-transform duration-300 w-full sm:w-auto"
            onClick={handleOpenAdminModal}
          >
            Novo Administrador
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-2 px-6 rounded-2xl transition-transform duration-300 mb-8 w-full sm:w-auto"
        >
          Sair
        </button>
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-3 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            Lista de Usuários
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow text-xs sm:text-base">
              <thead>
                <tr>
                  <th className="py-2 px-2 sm:px-4">ID</th>
                  <th className="py-2 px-2 sm:px-4">Nome</th>
                  <th className="py-2 px-2 sm:px-4">Email</th>
                  <th className="py-2 px-2 sm:px-4">Tipo</th>
                  <th className="py-2 px-2 sm:px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="py-2 px-2 sm:px-4">{user.id}</td>
                    <td className="py-2 px-2 sm:px-4">{user.name}</td>
                    <td className="py-2 px-2 sm:px-4">{user.email}</td>
                    <td className="py-2 px-2 sm:px-4">{user.type}</td>
                    <td className="py-2 px-2 sm:px-4 flex flex-col sm:flex-row gap-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded-2xl hover:bg-blue-600 transition text-xs"
                        onClick={() => handleEdit(user.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-2xl hover:bg-red-600 transition text-xs"
                        onClick={() => handleDelete(user.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {mensagem && (
            <p className="mt-4 text-center text-red-500 text-sm">{mensagem}</p>
          )}
        </div>
      </div>

      {/* Modal de edição */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md relative flex flex-col items-center">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-gray-700"
              aria-label="Fechar"
            >
              ×
            </button>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
              Editar Usuário
            </h2>
            <form
              onSubmit={handleUpdate}
              className="flex flex-col gap-3 sm:gap-4 w-full"
            >
              <input
                ref={inputNameRef}
                type="text"
                placeholder="Nome"
                required
                className="bg-gray-200 px-4 py-2 rounded-2xl outline-none text-sm"
              />
              <input
                ref={inputEmailRef}
                type="email"
                placeholder="Email"
                required
                className="bg-gray-200 px-4 py-2 rounded-2xl outline-none text-sm"
              />
              <input
                ref={inputPasswordRef}
                type="password"
                placeholder="Nova senha (opcional)"
                className="bg-gray-200 px-4 py-2 rounded-2xl outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-2xl font-bold hover:bg-blue-700 transition text-sm"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </form>
            {mensagem && <p className="mt-4 text-center text-sm">{mensagem}</p>}
            {loading && (
              <p className="mt-2 text-center text-sm">Carregando...</p>
            )}
          </div>
        </div>
      )}
      {showAdminModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-10 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md relative flex flex-col items-center">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-gray-700"
              aria-label="Fechar"
            >
              ×
            </button>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
              Novo Administrador
            </h2>
            <form
              onSubmit={handleCreateAdmin}
              className="flex flex-col gap-3 sm:gap-4 w-full"
            >
              <input
                ref={inputAdminNameRef}
                type="text"
                placeholder="Nome"
                required
                className="bg-gray-200 px-4 py-2 rounded-2xl outline-none text-sm"
              />
              <input
                ref={inputAdminEmailRef}
                type="email"
                placeholder="Email"
                required
                className="bg-gray-200 px-4 py-2 rounded-2xl outline-none text-sm"
              />
              <input
                ref={inputAdminPasswordRef}
                type="password"
                placeholder="Senha"
                required
                className="bg-gray-200 px-4 py-2 rounded-2xl outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-2xl font-bold hover:bg-green-700 transition text-sm"
                disabled={adminLoading}
              >
                {adminLoading ? "Salvando..." : "Criar"}
              </button>
            </form>
            {adminMensagem && (
              <p className="mt-4 text-center text-sm">{adminMensagem}</p>
            )}
            {adminLoading && (
              <p className="mt-2 text-center text-sm">Carregando...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
