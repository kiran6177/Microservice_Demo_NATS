import React, { useContext, useEffect } from 'react'
import { Outlet } from 'react-router'
import { Link } from 'react-router-dom'
import { AuthUserContext } from '../store/UserContext'
import axios from 'axios';

function Header() {
    const {user,setUser} = useContext(AuthUserContext);
    console.log(user);
    const handleSignout = async()=>{
        try {
            const response = await axios.get('api/users/signout',{headers:{Authorization:`Bearer ${user.userToken}`}})
            console.log(response.data);
            setUser(null)
            nav('/')
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className='header'>
      <div className='nav'>
        <h2>Ticketing</h2>
        <div className='tags'>
            {!user ?
            <>
            <h6><Link to={'/login'}>Login</Link></h6>
            <h6><Link to={'/signup'}>Signup</Link></h6>
            </> :
            <h6 onClick={handleSignout}>Signout</h6>}
        </div>
      </div>
        <Outlet/>
    </div>
  )
}

export default Header
