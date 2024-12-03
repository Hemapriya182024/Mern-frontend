
import React from 'react';
import LoginPage from './Pages/Auth/LoginPage';
import SignUpPage from './Pages/Auth/SignUpPage';
import HomePage from './Pages/Home/HomePage';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './Pages/notification/NotificationPage';
import ProfilePage from './Pages/profile/ProfilePage';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from './components/common/LoadingSpinner';
import Notfound from './Notfound';
import Jobs from './Pages/Jobs/Jobs';


export const baseurl = "https://backend-5ojg.onrender.com";
const App = () => {
  const { data: authUser, isLoading, isError, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("No token found in localStorage");
        return null;
      }
      const res = await axios.get(`${baseurl}/api/auth/me`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Error: {error?.message || "Failed to fetch user data."}</p>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className='flex max-w-6xl mx-auto'>
        {authUser && <Sidebar />}
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
          <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
          <Route path='/jobs' element={authUser ? <Jobs /> : <Navigate to='/login' />} />
          <Route path='/network' element={authUser ? <Notfound /> : <Navigate to='/login' />} />
          <Route path='/messaging' element={authUser ? <Notfound /> : <Navigate to='/login' />} />
          <Route path='/settings' element={authUser ? <Notfound /> : <Navigate to='/login' />} />
        </Routes>
        {authUser && <RightPanel />}
      </div>
    </>
  );
};

export default App;
