import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../../Modals/ConfirmationModal";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [reloadComp, setReloadComp] = useState(0);

  const getUsers = async () => {
    //local storage only supports string data;
    const parsedUserInfo = JSON.parse(localStorage.getItem("userInfo")); //parsing (conversting) string to object.

    const username = parsedUserInfo.name;
    const password = parsedUserInfo.password;

    console.log("Login cred-Local Storage: ", username, password); //Debug log

    try {
      const response = await axios.get(
        "http://localhost:4545/admin/usersList",
        {
          headers: {
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        }
      );

      console.log("USer mgng: ",response);
      

      if (response.status === 200) {
        setUsers(response.data);
        console.log("User List: ", response.data);
      }
    } catch (error) {
      console.log("Error ", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [reloadComp]);

  //   Delete - user
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const handleConfirmDelete = () => {
    setOpenConfirmationModal(false);
    return true;
  };
  const handleDeleteUser = async (email) => {
    console.log("Delete user: ", email);

    setOpenConfirmationModal(true);

    if (!handleConfirmDelete()) {
      console.log("confirmation not done");
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:4545/admin/delete-user/${email}`
      );

      if (response.status === "200") {
        console.log("Response: ", response.data);
        toast.success("User deleted successfully");
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message);
    }

    setReloadComp((prevKey) => prevKey + 1);
  };

  //   ------------------------------------------------------------------------------------------
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right dark:bg-gray-100 text-gray-500 dark:text-gray-400">
        {/* Table header  */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              User name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>

            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        {/* Users list */}
        <tbody key={reloadComp} className="mt-2">
          {Array.isArray(users) &&
            users.map((user) => (
              <tr
                key={user.id}
                className="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user.name}
                </th>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteUser(user.email)}
                    type="button"
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Delete User
                  </button>
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                  >
                    Change Role
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
        {openConfirmationModal && (
          <ConfirmationModal
            title={"Are you sure you want to delete this user?"}
            msgType={"danger"}
            onConfirm={handleConfirmDelete}
            onClose={() => setOpenConfirmationModal(false)}
          />
        )}
      </table>
    </div>
  );
};
