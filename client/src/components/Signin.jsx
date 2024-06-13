import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { AuthUserContext } from '../store/UserContext';
import axios from 'axios';

function Signin() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');    
    const [error,setError] = useState([]);
    const {user,setUser} = useContext(AuthUserContext)
    const navigate = useNavigate()

    const handleClick = async ()=>{
        try{
            console.log("signn");
            const response  = await axios.post('/api/users/login',{email,password});
            console.log(response.data);
            setUser(response.data)
            navigate('/')
            }catch(err){
                console.log(err.response.data);
                setError(err.response.data.errors.reasons)
            }
    }
    useEffect(()=>{
        if(user){
            navigate('/')
        }
    },[user])
  return (
    <div className='signup'>
        <h3>SIGNIN</h3>
      <div className='my-8'> 
                <label>Email</label>
                <input type="text" name='email' value={email} onChange={(e)=>setEmail(e.target.value)} className='w-[100%] p-2 border-2 border-[#000720] rounded-md bg-[#FFF8DF]' />
            </div>
            <div className='my-8'>
                <label>Password</label>
                <input type="password" name='password' value={password} onChange={(e)=>setPassword(e.target.value)} className='w-[100%] p-2 border-2 border-[#000720] rounded-md bg-[#FFF8DF]' />
            </div>
            {error.map((err,i)=>{
                return (
                    <p key={i}>{err.message}</p>
                )
            })}
            <div className='my-8'>
            <button type='submit' onClick={handleClick} className='btn'>SIGNUP</button>
            </div>
    </div>
  )
}

export default Signin
