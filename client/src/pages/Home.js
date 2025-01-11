/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// import axios from 'axios';
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
// import Sidebar from '../components/Sidebar';
// import logo from '../assets/logo.png';
// import io from 'socket.io-client';

// const Home = () => {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const fetchUserDetails = async () => {
//     try {
//       const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
//       const response = await axios.get(URL, { withCredentials: true });

//       if (response.data.data.logout) {
//         dispatch(logout());
//         navigate('/login'); // Redirect on logout
//         return;
//       }

//       dispatch(setUser(response.data.data));
//       console.log('Current user details:', response.data.data);
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//   /*** WebSocket connection ***/
//   useEffect(() => {
//     const socketURL ="https://chat-application-8qij.onrender.com"; // Ensure this is correctly set in your environment variables
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('Missing authentication token');
//       return;
//     }

//     const socketConnection = io(socketURL, {
//       transports: ['websocket'],
//       auth: { token },
//       reconnection: true,
//     });

//     socketConnection.on('connect', () => {
//       console.log('WebSocket connected:', socketConnection.id);
//     });

//     socketConnection.on('connect_error', (error) => {
//       console.error('WebSocket connection error:', error.message);
//     });

//     socketConnection.on('onlineUser', (data) => {
//       console.log('Online users:', data);
//       dispatch(setOnlineUser(data));
//     });

//     socketConnection.on('disconnect', (reason) => {
//       console.warn('WebSocket disconnected:', reason);
//       if (reason === 'io server disconnect') {
//         socketConnection.connect();
//       }
//     });

//     dispatch(setSocketConnection(socketConnection));

//     return () => {
//       socketConnection.disconnect();
//       console.log('WebSocket connection closed.');
//     };
//   }, []);

//   const basePath = location.pathname === '/';
//   return (
//     <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
//       <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
//         <Sidebar />
//       </section>

//       <section className={`${basePath && 'hidden'}`}>
//         <Outlet />
//       </section>

//       <div
//         className={`justify-center items-center flex-col gap-2 hidden ${
//           !basePath ? 'hidden' : 'lg:flex'
//         }`}
//       >
//         <div>
//           <img src={logo} width={250} alt="logo" />
//         </div>
//         <p className="text-lg mt-2 text-slate-500">Select user to send message</p>
//       </div>
//     </div>
//   );
// };

// export default Home;





// /* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  console.log('user',user)
  const fetchUserDetails = async()=>{
    try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
        const response = await axios({
          url : URL,
          withCredentials : true
        })

        dispatch(setUser(response.data.data))

        if(response.data.data.logout){
            dispatch(logout())
            navigate("/email")
        }
        console.log("current user Details",response)
    } catch (error) {
        console.log("error",error)
    }
  }

  useEffect(()=>{
    fetchUserDetails()
  },[])

  /***socket connection */
  useEffect(()=>{
    const socketConnection = io("https://chat-application-wmv9.onrender.com",{
      auth : {
        token : localStorage.getItem('token')
      },
    })

    socketConnection.on('onlineUser',(data)=>{
      console.log(data)
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return ()=>{
      socketConnection.disconnect()
    }
  },[])


  const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
           <Sidebar/>
        </section>

        {/**message component**/}
        <section className={`${basePath && "hidden"}`} >
            <Outlet/>
        </section>


        <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
            <div>
              <img
                src={logo}
                width={250}
                alt='logo'
              />
            </div>
            <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
        </div>
    </div>
  )
}

export default Home
