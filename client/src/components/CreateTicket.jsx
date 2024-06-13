import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthUserContext } from '../store/UserContext';
import { useNavigate } from 'react-router';

function CreateTicket() {
    const [title,setTitle] = useState('');
    const [price,setPrice] = useState(0);
    const {user} = useContext(AuthUserContext);
    const nav = useNavigate()

    useEffect(()=>{
        if(!user){
            nav('/login');
            return
        }
    },[user])

    const handleTicket = async()=>{
        try {
            const response = await axios.post('/api/tickets/create',{title,price},{headers:{Authorization:`Bearer ${user.userToken}`}})
            console.log(response)
            nav('/')
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'2rem'}}>
      <h2>Create Your Ticket</h2>
      <div>
        <label>Title :</label>
        <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} />
      </div>
      <div>
        <label>Price :</label>
        <input type="text" value={price} onChange={(e)=>setPrice(e.target.value)} />
      </div>
      <div>
        <button onClick={handleTicket} style={{padding:'0.5rem 1rem'}}>Create</button>
      </div>
    </div>
  )
}

export default CreateTicket
