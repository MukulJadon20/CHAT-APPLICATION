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

  console.log('User state:', user)

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
      const response = await axios.get(URL, { withCredentials: true })

      if (response.data?.data) {
        dispatch(setUser(response.data.data))

        if (response.data.data.logout) {
          dispatch(logout())
          navigate("/email")
        }
        console.log("User details fetched:", response.data.data)
      } else {
        console.error("User details not found in the response")
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  /***socket connection */
  useEffect(() => {
    const socketURL = process.env.REACT_APP_BACKEND_URL

    // Ensure the WebSocket URL is valid
    if (!socketURL) {
      console.error("WebSocket URL is not defined in the environment variables")
      return
    }

    const socketConnection = io(socketURL, {
      auth: {
        token: localStorage.getItem('token'),
      },
      transports: ['websocket'], // Explicitly use WebSocket transport
    })

    // Log socket events for debugging
    socketConnection.on('connect', () => {
      console.log("WebSocket connected with ID:", socketConnection.id)
    })

    socketConnection.on('connect_error', (error) => {
      console.error("WebSocket connection error:", error)
    })

    socketConnection.on('disconnect', (reason) => {
      console.warn("WebSocket disconnected:", reason)
    })

    socketConnection.on('onlineUser', (data) => {
      console.log("Online users:", data)
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return () => {
      socketConnection.disconnect()
    }
  }, [])

  const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/* Message Component */}
      <section className={`${basePath && "hidden"}`} >
        <Outlet />
      </section>

      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
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
