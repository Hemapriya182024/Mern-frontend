import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { baseurl } from "../../App";
import toast from "react-hot-toast";
import axios from "axios";

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);  // Added modal state

  const queryClient = useQueryClient();
  const token = localStorage.getItem('authToken');

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(
          `${baseurl}/api/users/update`,
          {
            fullName: formData.fullName,
            username: formData.username,
            email: formData.email,
            bio: formData.bio,
            link: formData.link,
            newPassword: formData.newPassword,
            currentPassword: formData.currentPassword,
          },
          { withCredentials: true , headers: { Authorization: `Bearer ${token}` }, }
        );

        if (res.status !== 200) {
          throw new Error(res.data.error || "Something went wrong");
        }

        return res.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Profile updated");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
      setIsModalOpen(false);  // Close the modal after successful update
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update");
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  const validatePasswords = () => {
    if (formData.newPassword && formData.newPassword !== formData.currentPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validatePasswords()) {
      updateProfile();
    }
  };

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() => setIsModalOpen(true)}  // Open the modal
      >
        Edit profile
      </button>

      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box border rounded-md border-gray-700 shadow-md">
            <h3 className="font-bold text-lg my-3">Update Profile</h3>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.fullName}
                  name="fullName"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.username}
                  name="username"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.email}
                  name="email"
                  onChange={handleInputChange}
                />
                <textarea
                  placeholder="Bio"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.bio}
                  name="bio"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.currentPassword}
                  name="currentPassword"
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="flex-1 input border border-gray-700 rounded p-2 input-md"
                  value={formData.newPassword}
                  name="newPassword"
                  onChange={handleInputChange}
                />
              </div>
              <input
                type="text"
                placeholder="Link"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.link}
                name="link"
                onChange={handleInputChange}
              />
              <button className="btn btn-primary rounded-full btn-sm text-white">
                {isUpdatingProfile && <LoadingSpinner size="sm" />}
                {isUpdatingProfile ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button className="outline-none" onClick={() => setIsModalOpen(false)}>Close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default EditProfileModal;
