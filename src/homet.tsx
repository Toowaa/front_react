import axios from "axios";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const baseUrl = "http://localhost:3000/user/email/";
const baseUrlEdit = "http://localhost:3000/user/";

interface UserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  id: number;
}

interface UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}
export default function Home() {
  const [userData, setUserData] = useState<UserDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserDto | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        if (!token || !email) {
          throw new Error("Token o email no encontrado en localStorage");
        }

        const response = await axios.get<UserDto>(`${baseUrl}${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userDataWithoutPassword = {
          ...response.data,
          password: "",
        };

        setUserData(userDataWithoutPassword);
        setEditedData(userDataWithoutPassword);
      } catch (err) {
        console.error("Error al obtener datos de usuario:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !editedData) {
        throw new Error("Token no encontrado o datos no válidos");
      }

      const updateData: UpdateUserDto = {
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        email: editedData.email,
      };

      if (isPasswordChanged && newPassword) {
        updateData.password = newPassword;
      }

      await axios.patch(`${baseUrlEdit}${userData?.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData({
        ...editedData,
        password: "",
      });
      setIsEditing(false);
      setNewPassword("");
      setIsPasswordChanged(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/"; // Redirige a la página de inicio de sesión
  };
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token || !editedData) {
        throw new Error("Token no encontrado o datos no válidos");
      }
      await axios.delete(`${baseUrlEdit}${userData?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      window.location.href = "/";
    } catch (error) {}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "password") {
      setNewPassword(value);
      setIsPasswordChanged(true);
    } else {
      setEditedData((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  function deletepop() {
    return (
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        className="relative z-10"
      >
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Eliminar cuenta
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar tu cuenta? Esta
                        acción no se puede deshacer y todos tus datos serán
                        eliminados permanentemente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={() => {
                    handleDelete();
                    setIsDeleteDialogOpen(false);
                  }}
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-center mb-6">
            <img
              src="https://i.pinimg.com/originals/81/09/b4/8109b4cc02fd1e28fffea78541faf8a1.png"
              alt="User Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                name="firstName"
                type="text"
                value={
                  isEditing
                    ? editedData?.firstName || ""
                    : userData?.firstName || ""
                }
                readOnly={!isEditing}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                name="lastName"
                type="text"
                value={
                  isEditing
                    ? editedData?.lastName || ""
                    : userData?.lastName || ""
                }
                readOnly={!isEditing}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="text"
                value={
                  isEditing ? editedData?.email || "" : userData?.email || ""
                }
                readOnly={!isEditing}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {isEditing ? "Nueva Contraseña" : "Contraseña"}
              </label>
              <input
                name="password"
                type="password"
                value={isEditing ? newPassword : "••••••••"}
                readOnly={!isEditing}
                onChange={handleInputChange}
                placeholder={isEditing ? "Ingresa nueva contraseña" : ""}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {isEditing && (
                <p className="mt-1 text-sm text-gray-500">
                  Deja este campo vacío si no deseas cambiar tu contraseña
                </p>
              )}
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                type="button"
                className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Actualizar
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                type="button"
                className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Guardar
              </button>
              
              
            )}
            
            <button
                  type="button"
                  className="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="text-white justify-end bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-44 py-2.5 my-4 text-center me-2 mb-2"
        >
          Eliminar Cuenta
        </button>
      </div>
      {deletepop()}

      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        className="relative z-10"
      >
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      ¡Actualización Exitosa!
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Tus datos han sido actualizados correctamente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
                <div className="sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                    onClick={() => setShowSuccessDialog(false)}
                  >
                    Aceptar
                  </button>
                </div>
                
              
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
