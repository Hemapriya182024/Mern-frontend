import { MdHomeFilled } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";
import { BsBriefcase, BsChatDots } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut, BiCog } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast"; // Import toast for notifications
import { baseurl } from "../../App";

const Sidebar = () => {
  const navigate = useNavigate(); // To navigate after logout
  const data = {
    fullName: "John Doe",
    username: "johndoe",
    profileImg: "/avatars/boy1.png",
    tagline: "MERN Developer | Open to Opportunities",
  };

  // Mutation for logout
  const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				// Using Axios for the API call
        localStorage.removeItem("jwtToken");
				const { data } = await axios.post(`${baseurl}/api/auth/logout`);
				return data; // Axios response data
			} catch (error) {
				// Handle Axios errors
				const message = error.response?.data?.error || "Something went wrong";
				throw new Error(message);
			}
		},
		onSuccess: () => {
			// Invalidate queries to refresh the auth user state
		
			toast.success("Logout successful!");
		},
		onError: (error) => {
			// Show error toast message
			toast.error(error.message || "Logout failed");
		},
	});

  return (
    <div className="w-20 md:w-64 bg-gray-100 h-screen flex flex-col shadow-md">
      {/* Profile Section */}
      {data && (
        <div className="flex flex-col items-center md:items-start p-4 border-b border-gray-300">
          <Link to={`/profile/${data.username}`}>
            <div className="avatar w-16 h-16 mb-2">
              <img
                className="rounded-full"
                src={data.profileImg || "/avatar-placeholder.png"}
                alt="Profile"
              />
            </div>
          </Link>
          <div className="hidden md:block">
            <p className="text-gray-900 font-bold">{data.fullName}</p>
            <p className="text-gray-600 text-sm">{data.tagline}</p>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <ul className="flex flex-col mt-4 space-y-3">
        <li>
          <Link
            to="/"
            className="flex items-center gap-3 p-3 hover:bg-gray-200 transition rounded-md"
          >
            <MdHomeFilled className="w-6 h-6 text-gray-700" />
            <span className="hidden md:inline text-gray-800">Home</span>
          </Link>
        </li>
        <li>
          <Link
            to="/network"
            className="flex items-center gap-3 p-3 hover:bg-gray-200 transition rounded-md"
          >
            <IoMdPeople className="w-6 h-6 text-gray-700" />
            <span className="hidden md:inline text-gray-800">My Network</span>
          </Link>
        </li>
        <li>
          <Link
            to="/jobs"
            className="flex items-center gap-3 p-3 hover:bg-gray-200 transition rounded-md"
          >
            <BsBriefcase className="w-6 h-6 text-gray-700" />
            <span className="hidden md:inline text-gray-800">Jobs</span>
          </Link>
        </li>
        <li>
          <Link
            to="/messaging"
            className="flex items-center gap-3 p-3 hover:bg-gray-200 transition rounded-md"
          >
            <BsChatDots className="w-6 h-6 text-gray-700" />
            <span className="hidden md:inline text-gray-800">Messaging</span>
          </Link>
        </li>
        <li>
          <Link
            to="/notifications"
            className="flex items-center gap-3 p-3 hover:bg-gray-200 transition rounded-md"
          >
            <IoNotifications className="w-6 h-6 text-gray-700" />
            <span className="hidden md:inline text-gray-800">Notifications</span>
          </Link>
        </li>
      </ul>

      {/* Settings and Logout */}
      <div className="mt-auto p-4 border-t border-gray-300">
        <ul className="flex flex-col space-y-3">
          <li>
            <Link
              to="/settings"
              className="flex items-center gap-3 p-3 hover:bg-gray-200 transition rounded-md"
            >
              <BiCog className="w-6 h-6 text-gray-700" />
              <span className="hidden md:inline text-gray-800">Settings</span>
            </Link>
          </li>
          <li>
            <button
              onClick={() => logout()} // This triggers the logout function when clicked
              className="flex items-center gap-3 p-3 w-full hover:bg-gray-200 transition rounded-md"
            >
              <BiLogOut className="w-6 h-6 text-gray-700" onClick={(e)=>{ e.preventDefault();
                logout();}} />
              <span className="hidden md:inline text-gray-800">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
