import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { baseurl } from "../../App.jsx";
import toast from "react-hot-toast";

const NotificationPage = () => {
	const queryClient=useQueryClient()
	const token = localStorage.getItem('authToken');
	const {data:notifications,isLoading}=useQuery(
		
		{
			queryKey:["notification"],
			queryFn:async()=>{
				try {
					const res=await axios.get(`${baseurl}/api/notification`,{withCredentials:true,headers: { Authorization: `Bearer ${token}` },})
					console.log(res.data)
					return res.data
					
				} catch (error) {
					throw error
					
				}
			}
		}
	)
	const{mutate:delete_Notification}=useMutation(
		{
			mutationFn:async()=>{
				try {
					const token = localStorage.getItem('authToken');
					const res=await axios.delete(`${baseurl}/api/notification`,{withCredentials:true,headers: { Authorization: `Bearer ${token}` },})
					return res.data
					
				} catch (error) {
					
				}
			},
			onSuccess:()=>{
				toast.success("All notifications deleted sucessfully !! ")
				queryClient.invalidateQueries({
					queryKey:["notification"]
			
				})
			}
		}
	)

	const deleteNotifications = () => {
		delete_Notification()
		
		
	};

	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
  <div className='flex justify-between items-center p-4 border-b border-gray-700'>
    <p className='font-bold text-lg'>Notifications</p>
    <div className='dropdown'>
      <div tabIndex={0} role='button' className='m-1'>
        <IoSettingsOutline className='w-5 h-5 text-gray-600 hover:text-primary transition' />
      </div>
      <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
        <li>
          <a onClick={deleteNotifications} className='hover:bg-gray-100 p-2 rounded'>
            Delete all notifications
          </a>
        </li>
      </ul>
    </div>
  </div>

  {isLoading && (
    <div className='flex justify-center h-full items-center'>
      <LoadingSpinner size='lg' />
    </div>
  )}

  {notifications?.length === 0 && (
    <div className='text-center p-4 font-bold text-gray-600'>No notifications 🤔</div>
  )}

  {notifications?.map((notification) => (
    <div className='border-b border-gray-700' key={notification._id}>
      <div className='flex gap-4 p-4 hover:bg-gray-800 transition rounded-lg'>
        {notification.type === 'follow' && (
          <FaUser className='w-8 h-8 text-primary transition' />
        )}
        {notification.type === 'like' && (
          <FaHeart className='w-8 h-8 text-red-500 transition' />
        )}

        <Link to={`/profile/${notification.from.username}`} className='flex gap-3 items-center w-full'>
          <div className='avatar'>
            <div className='w-10 h-10 rounded-full overflow-hidden'>
              <img src={notification.from.profileImg || '/profile.jpeg'} className='object-cover w-full h-full' />
            </div>
          </div>
          <div className='flex flex-col'>
            <span className='font-bold text-gray-300'>
              @{notification.from.username}
            </span>
            <span className='text-sm text-gray-500'>
              {notification.type === 'follow' ? 'followed you' : 'liked your post'}
            </span>
          </div>
        </Link>
      </div>
    </div>
  ))}
</div>

		</>
	);
};
export default NotificationPage;