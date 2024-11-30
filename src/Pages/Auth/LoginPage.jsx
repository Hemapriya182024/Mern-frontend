import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import XSvg from '../../components/svgs/X';
import { MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";  
import { baseurl } from "../../App";
import toast from 'react-hot-toast';
import LoadingSpinner from "../../components/common/LoadingSpinner";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const queryClient=useQueryClient()

  const navigate = useNavigate();  

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      // console.log(username,password)
      const res = await axios.post(`${baseurl}/api/auth/login`, { username, password }, { withCredentials: true });
      return res.data;
    },
    onSuccess: (data) => {
      // Log the response data to ensure login success
     
      
      // Show success toast
      toast.success("Login successful!");
      queryClient.invalidateQueries({
        querykey:["authUser "]
      })
      // navigate("/");  
    },
    onError: (error) => {
      // Log the error for debugging purposes
      console.log(error);

      // Show error toast
      toast.error("Login failed: " + (error?.response?.data?.message || error?.message || "Something went wrong"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      alert("Please fill out all fields.");
      return;
    }
    mutate(formData);  // This will trigger the mutation
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src='https://i.pinimg.com/736x/a6/fc/8c/a6fc8ce5fe45cde6d71078f30a525b00.jpg' className="lg:w-2/3 " />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <img src='https://i.pinimg.com/736x/a6/fc/8c/a6fc8ce5fe45cde6d71078f30a525b00.jpg' className="w-24 lg:hidden" />
          <h1 className="text-4xl font-extrabold">{"Let's"} go.</h1>
          
          <label className="input input-bordered rounded flex items-center gap-2">
            <FaUser  />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          
          <button className="btn rounded-full btn-primary" disabled={isPending}>
            {isPending ? <LoadingSpinner /> : "Login"}
          </button>
        </form>
        
        <div className="flex flex-col gap-2 mt-4">
          <p className=" text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;