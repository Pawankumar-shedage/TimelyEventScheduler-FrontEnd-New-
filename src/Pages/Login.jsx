import axios from 'axios';
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginSuccess } from '../auth/Redux/authSliceRed';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("Form Data: ", formData); //Debug log

    try {
      const response = await axios.post(
        "http://localhost:4545/users/do-login",
        formData
      );

      if (response.status === 200) {
        console.log("Response for user-login: ", response);

        const user = response.data;
        // save user in redux store
        dispatch(loginSuccess(user));

        toast.success("Login successful!");

        // Navigate
        navigate("/")
      } else {
        // Handle cases where status is not 200 but response is still successful
        toast.error("Login failed! Please try again."); // Generic error message
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error.response) {
        // Handle HTTP errors
        console.log(error.response.data);
        toast.error(error.response.data || "An error occurred!"); // Use error message from response
      } else {
        // Handle network errors or unexpected issues
        toast.error("Network error! Please check your connection.");
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 max-w-sm mx-auto border-2 border-gray-300 rounded-lg p-5"
    >
      {/* header  */}
      <div className="mb-5 border-b-2 border-gray-300">
        <h1 className="text-3xl pb-3 text-gray-900 dark:text-white">Login</h1>
      </div>

      {/* Form Content */}
      <div className="mb-5 ">
        {/* Email */}
        <label
          htmlFor="email"
          className="mt-4 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Enter email
        </label>
        <input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@gmail.com"
          required
        />
      </div>

      {/* Password */}
      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Enter password
        </label>
        <input
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          type="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>

      {/* TODO: Remember me  */}
      {/* <div className="flex items-start mb-5">
        <div className="flex items-center h-5">
          <input
            id="remember"
            type="checkbox"
            value=""
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            required
          />
        </div>
        <label
          htmlFor="remember"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Remember me
        </label>
      </div> */}

      {/* Submit Form */}
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Login
      </button>
    </form>
  )
}