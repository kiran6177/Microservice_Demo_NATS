import React, { useContext, useState } from 'react';
import axios from 'axios'
import { AuthUserContext } from '../store/UserContext';
import { useNavigate } from 'react-router';

function Signup() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');    
    const [error,setError] = useState([]);
    const {user,setUser} = useContext(AuthUserContext)
    const navigate = useNavigate()
    const handleClick = async ()=>{
        try{
        const response  = await axios.post('/api/users/signup',{email,password});
        console.log(response.data);
        setUser(response.data)
        navigate('/')
        }catch(err){
            console.log(err.response.data);
            setError(err.response.data.errors.reasons)
        }
    }
  return (
    <div className='signup'>
        <h3>SIGNUP</h3>
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

export default Signup
