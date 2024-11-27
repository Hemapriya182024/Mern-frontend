import React from 'react'
import LoginPage from './Pages/Auth/LoginPage'
import SignUpPage from './Pages/Auth/SignUpPage'
import HomePage from './Pages/Home/HomePage'
import { Route ,Routes } from 'react-router-dom'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './Pages/notification/NotificationPage'
import ProfilePage from './Pages/profile/ProfilePage'
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import LoadingSpinner from './components/common/LoadingSpinner'

export const baseurl="http://localhost:4000"

const App = () => {
  const { data:authUser, isLoading, isError, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token")
        console.log("token", token)

        if (!token) {
          throw new Error("No token found. Please log in again.")
        }

        const res = await axios.get(`${baseurl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.status !== 200) {
          throw new Error("Failed to fetch user. Please try again.")
        }

        return res.data // Return the response data
      } catch (error) {
        console.error(error)
        throw new Error(error.response?.data?.message || error.message || "Failed to fetch user.")
      }
    },
    retry: false, // Disabling retries for failed requests
  })
if(isLoading)
{
  return (
    <div className='flex justify-center items-center h-screen'>
      <LoadingSpinner size='lg' />
    </div>

  )
    
  
}

 
  return (
    <>  
     <Toaster/>
    <div className='flex max-w-6xl mx-auto'>
   
      <Sidebar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
      </Routes>
      <RightPanel />
      </div>  
    </>
  
  )
}

export default App
