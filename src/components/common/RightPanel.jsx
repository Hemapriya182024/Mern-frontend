import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { baseurl } from "../../App.jsx";
import useFollow from "../../hooks/useFollow.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

const RightPanel = () => {
    const { data: suggestedUsers, isLoading, isError } = useQuery({
        queryKey: ["suggestedUsers"],
        queryFn: async () => {
            const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
            if (!token) {
                throw new Error("No token found in localStorage.");
            }

            const res = await axios.get(`${baseurl}/api/users/suggested`, {
                withCredentials: true, // Include cookies if needed
                headers: { Authorization: `Bearer ${token}` }, // Add Bearer token
            });
            return res.data;
        },
        onError: (error) => {
            console.error("Error fetching suggested users:", error);
        },
        onSuccess: () => {
            console.log("Suggested users fetched successfully.");
        },
    });


    const { follow, isPending } = useFollow();

    if (!suggestedUsers || suggestedUsers.length === 0) {
        return <div className="md:w-64 w-0"></div>;
    }

    return (
        <div className='hidden lg:block my-4 mx-2'>
            <div className='p-4 rounded-md sticky top-2'>
                <p className='font-bold'>Who to follow</p>
                <div className='flex flex-col gap-4'>
                    {/* Skeleton loading */}
                    {isLoading && (
                        <>
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                            <RightPanelSkeleton />
                        </>
                    )}
                    {/* Error fallback */}
                    {isError && <p className='text-red-500'>Failed to load suggested users. Please try again.</p>}
                    {/* Suggested users */}
                    {!isLoading &&
                        (suggestedUsers || []).map((user) => (
                            <Link
                                to={`/profile/${user.username}`}
                                className='flex items-center justify-between gap-4'
                                key={user._id}
                            >
                                <div className='flex gap-2 items-center'>
                                    <div className='avatar'>
                                        <div className='w-8 rounded-full'>
                                            <img
                                                src={user.profileImg || "/profile.jpeg"}
                                                alt={user.fullName || "Default Avatar"}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold tracking-tight truncate w-28'>
                                            {user.fullName}
                                        </span>
                                        <span className='text-sm text-slate-500'>@{user.username}</span>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            follow(user._id);
                                        }}
                                    >
                                        {isPending ? <LoadingSpinner size='sm' /> : "Follow"}
                                    </button>
                                </div>
                            </Link>
                        ))}
                    {!isLoading && suggestedUsers?.length === 0 && (
                        <p className='text-gray-500'>No users to follow at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RightPanel;
