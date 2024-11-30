import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useState } from "react";
import axios from "axios";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import XSvg from "../../components/svgs/X";
import { baseurl } from "../../App";
import { toast } from 'react-hot-toast'; // Import toast from react-hot-toast
import LoadingSpinner from "../../components/common/LoadingSpinner";

const SignUpPage = () => {
    const navigate = useNavigate(); // Use useNavigate hook
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullname: "",
        password: "",
    });

    // Mutation for handling signup API call
    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: async ({ email, username, fullname, password }) => {
            try {
                const res = await axios.post(`${baseurl}/api/auth/signup`, {
                    email,
                    username,
                    fullname,
                    password,
                });
                return res.data; // Response to handle after success
            } catch (err) {
                throw new Error(err.response?.data?.message || "Something went wrong");
            }
        },
        
        onSuccess: () => {
            toast.success("Signup successful!"); // Display success toast
            navigate("/login"); // Redirect to the login page
        },
        onError: (error) => {
            toast.error(error.message || "Signup failed!"); // Display error toast
        },
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(formData); // Trigger the mutation with formData
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-screen-xl mx-auto flex h-screen px-10">
            {/* Left Side (SVG Display) */}
            <div className="flex-1 hidden lg:flex items-center justify-center ">
             <img src='https://i.pinimg.com/736x/a6/fc/8c/a6fc8ce5fe45cde6d71078f30a525b00.jpg'  className="lg:w-2/3 " />
            </div>

            {/* Right Side (Signup Form) */}
            <div className="flex-1 flex flex-col justify-center items-center">
                <form
                    className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
                    onSubmit={handleSubmit}
                >
                    <img src='https://i.pinimg.com/736x/a6/fc/8c/a6fc8ce5fe45cde6d71078f30a525b00.jpg'   className="w-24 lg:hidden" />
                    <h1 className="text-4xl font-extrabold">Join today.</h1>

                    {/* Email Input */}
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <MdOutlineMail />
                        <input
                            type="email"
                            className="grow"
                            placeholder="Email"
                            name="email"
                            onChange={handleInputChange}
                            value={formData.email}
                            required
                        />
                    </label>

                    {/* Username and Full Name Inputs */}
                    <div className="flex gap-4 flex-wrap">
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <FaUser />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Username"
                                name="username"
                                onChange={handleInputChange}
                                value={formData.username}
                                required
                            />
                        </label>
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <MdDriveFileRenameOutline />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Full Name"
                                name="fullname"
                                onChange={handleInputChange}
                                value={formData.fullname}
                                required
                            />
                        </label>
                    </div>

                    {/* Password Input */}
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <MdPassword />
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password}
                            required
                        />
                    </label>

                    {/* Submit Button */}
                    <button
                        className="btn rounded-full btn-primary"
                        disabled={isPending}
                    >
                        {isPending ? <LoadingSpinner /> : "Sign up"}
                    </button>

                    {/* Error Message */}
                    {isError && (
                        <p className="text-red-500">
                            {error.message || "Something went wrong"}
                        </p>
                    )}
                </form>

                {/* Link to Login Page */}
                <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
                    <p className="text-white text-lg">Already have an account?</p>
                    <Link to="/login">
                        <button className="btn rounded-full btn-primary btn-outline w-full">
                            Sign in
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
