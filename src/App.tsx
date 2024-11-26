import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

const baseUrl = "http://localhost:3000/auth/login";

interface LoginResponse {
  access_token: string;
}

interface LoginError {
  message: string;
  statusCode: number;
}


export default function App() {
  const navigate = useNavigate();
  const [newFirstName, setFname] = useState("");
  const [newLastName, setLname] = useState("");
  const [newEmail, setNemail] = useState("");
  const [newPassword, setNpassword] = useState("");

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const baseurl = "http://localhost:3000/user";

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${baseurl}`, {
        firstName:newFirstName,
        lastName:newLastName,
        email:newEmail,
        password:newPassword,
      });
      setIsDeleteDialogOpen(false);
      loading
    } catch (error) {
      console.error("Registration error", error);
     
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const response = await axios.post<LoginResponse>(
        baseUrl,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("email", email);
   
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;
      navigate("/home");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data as LoginError;
        console.error("Login error:", errorData);

        setError(
          errorData?.message ||
            "Error en el inicio de sesión. Por favor verifica tus credenciales."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  function registre() {
    return (
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        className="relative z-10"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center pb-4 border-b mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Registro de Usuario
              </h2>
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  value={newFirstName}
                  onChange={(e) => setFname(e.target.value)}
                  type="text"
                  id="firstName"
                  className="mt-1 block w-full text-center  rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Ingrese su nombre"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apellido
                </label>
                <input
                  value={newLastName}
                  onChange={(e) => setLname(e.target.value)}
                  type="text"
                  id="lastName"
                  className="mt-1 block w-full text-center  rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Ingrese su apellido"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo Electrónico
                </label>
                <input
                  value={newEmail}
                  onChange={(e) => setNemail(e.target.value)}
                  type="email"
                  id="email"
                  className="mt-1 block w-full text-center  rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  value={newPassword}
                  onChange={(e) => setNpassword(e.target.value)}
                  type="password"
                  id="password"
                  className="mt-1 block w-full text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Ingrese su contraseña"
                />
              </div>

              <div className="flex justify-between space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={handleCreate}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img

              src="public\gato.webp"

              alt="Your Company"
           
              className="mx-auto h-40 w-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
              Sign in to your account
            </h2>
          </div>
          {error && (
            <div
              className="
                mt-4 
                sm:mx-auto 
                sm:w-full 
                sm:max-w-sm 
                bg-red-100 
                border 
                border-red-400 
                text-red-700 
                px-4 
                py-3 
                rounded 
                relative 
                animate-pulse
                transition-all
                duration-300
                ease-in-out
              "
              role="alert"
            >
              <span className="block sm:inline font-bold">
                <svg
                  className="w-5 h-5 inline mr-2 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </span>
            </div>
          )}

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleLogin} method="POST" className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-white  "
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-white"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="text-white flex w-full justify-center  bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-white">
              Nuevo usuario?{"  "}
              <a
                onClick={() => setIsDeleteDialogOpen(true)}
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Registre nueva cuenta
              </a>
              {registre()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
