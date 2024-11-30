import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import { baseurl } from "../../App";
import { formatMemberSinceDate } from "../../utils/data";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  
  const { username } = useParams();
  const{data:authUser}=useQuery({queryKey:["authUser"]})
  const queryClient=useQueryClient()
  const {follow,isPending}=useFollow()
 

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryFn: async () => {
      try {
        const res = await axios.get(`${baseurl}/api/users/profile/${username}`, {
          withCredentials: true,
        });
        if (res.status !== 200) {
          throw new Error(res.statusText || "Something went wrong");
        }
        return res.data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
    },
    queryKey: ["userProfile", username],
    enabled: !!username, // Ensures query doesn't run if username is undefined
  });


  useEffect(() => {
    if (username) {
      refetch();
    }
  }, [username, refetch]);

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(
          `${baseurl}/api/users/update`,
          { coverImg, profileImg },
          { withCredentials: true }
        );
        if (res.status !== 200) {
          throw new Error(res.statusText || "Something went wrong");
        }
        return res.data;
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Profile updated");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
  
  const memberSinceData=formatMemberSinceDate(user?.createdAt)
  const amIFollowing=authUser?.following.includes(user?._id)

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (state === "coverImg") setCoverImg(reader.result);
        console.log("Cover Image Set:", reader.result); 
        if (state === "profileImg") setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const isMyProfile = authUser?._id === user?._id; 
 

  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      {/* HEADER */}
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
      {!isLoading && !isRefetching && !user && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      {!isLoading && !isRefetching && user && (
        <div className="flex flex-col">
          <div className="flex gap-10 px-4 py-2 items-center">
            <Link to="/">
              <FaArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex flex-col">
              <p className="font-bold text-lg">{user?.fullName}</p>
              <span className="text-sm text-slate-500">{POSTS?.length} posts</span>
            </div>
          </div>
          {/* COVER IMG */}
          <div className="relative group/cover">
            <img
              src={coverImg || user?.coverImg || "/coverImg.jpg"}
              className="h-52 w-full object-cover"
              alt="cover"
            />
            {isMyProfile && (
              <div
                className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                onClick={() => coverImgRef.current.click()}
              >
                <MdEdit className="w-5 h-5 text-white" />
              </div>
            )}
            <input
              type="file"
              hidden
              ref={coverImgRef}
              onChange={(e) => handleImgChange(e, "coverImg")}
            />
            <input
              type="file"
              hidden
              ref={profileImgRef}
              onChange={(e) => handleImgChange(e, "profileImg")}
            />
            {/* USER AVATAR */}
            <div className="avatar absolute -bottom-16 left-4">
              <div className="w-32 rounded-full relative group/avatar">
                <img
                  src={profileImg || user?.profileImg || "/profile.jpeg"}
                  alt="profile"
                />
                {isMyProfile && (
                  <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                    <MdEdit
                      className="w-4 h-4 text-white"
                      onClick={() => profileImgRef.current.click()}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end px-4 mt-5">
            {isMyProfile && <EditProfileModal />}
            {!isMyProfile && (
               <button
               className="btn btn-outline rounded-full btn-sm"
               onClick={() => follow(user?._id)} // Perform follow/unfollow action
               disabled={isPending || amIFollowing} // Disable the button if following or request is pending
             >
               {isPending ? (
                 <LoadingSpinner size="sm" />
               ) : (
                 amIFollowing ? "Following" : "Follow" // Toggle text based on follow status
               )}
             </button>
             
             
             
            )}
            {(coverImg || profileImg) && (
              <button
                className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                onClick={() => updateProfile() }
              >
               {isUpdatingProfile && <LoadingSpinner size="sm" /> }
               {!isUpdatingProfile && "Update"}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-14 px-4">
            <div className="flex flex-col">
              <span className="font-bold text-lg">{user?.fullName}</span>
              <span className="text-sm text-slate-500">@{user?.username}</span>
              <span className="text-sm my-1">{user?.bio}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {user?.link && (
                <div className="flex gap-1 items-center">
                  <FaLink className="w-3 h-3 text-slate-500" />
                  <a
                    href={user.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {user.link}
                  </a>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-500"> {memberSinceData}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-1 items-center">
                <span className="font-bold text-xs">{user?.following?.length || 0}</span>
                <span className="text-slate-500 text-xs">Following</span>
              </div>
              <div className="flex gap-1 items-center">
                <span className="font-bold text-xs">{user?.followers?.length || 0}</span>
                <span className="text-slate-500 text-xs">Followers</span>
              </div>
            </div>
          </div>
          <div className="flex w-full border-b border-gray-700 mt-4">
            <div
              className={`flex justify-center flex-1 p-3 ${
                feedType === "posts" ? "text-primary" : "text-slate-500"
              } hover:bg-secondary transition duration-300 relative cursor-pointer`}
              onClick={() => setFeedType("posts")}
            >
              Posts
              {feedType === "posts" && (
                <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
              )}
            </div>
            <div
              className={`flex justify-center flex-1 p-3 ${
                feedType === "likes" ? "text-primary" : "text-slate-500"
              } hover:bg-secondary transition duration-300 relative cursor-pointer`}
              onClick={() => setFeedType("likes")}
            >
              Likes
              {feedType === "likes" && (
                <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
              )}
            </div>
          </div>
        </div>
      )}
      <Posts feedType={feedType} username={username} userId={user?._id} />
    </div>
  );
};

export default ProfilePage;
