
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
      try {
        const res = await axios.get(`${baseurl}/api/auth/me`, { withCredentials: true });
        console.log("API Response:", res); // Log the full API response
        return res.data;
      } catch (err) {
        console.error("API Error:", err);
        return null;
      }
    },
    retry: false,
  });

  console.log(authUser);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Toaster />
      <div className='flex max-w-6xl mx-auto'>
        {/* Only render Sidebar and RightPanel if authUser exists */}
        {authUser && <Sidebar />}
        
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
          <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
         
          <Route path='/jobs' element={authUser ? <Jobs /> : <Navigate to='/login' /> } />
          <Route path='/network' element={authUser ? <Notfound />: <Navigate to='/login' /> } />
          <Route path='/messaging' element={authUser ? <Notfound />: <Navigate to='/login' /> } />
          <Route path='/settings' element={authUser ? <Notfound />: <Navigate to='/login' /> } />
         

        </Routes>

        {/* Only render RightPanel if authUser exists */}
        {authUser && <RightPanel />}
      </div>
    </>
  );
};

export default App;