import React, { useContext, useEffect, useState } from 'react'
import { AuthUserContext } from '../store/UserContext'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Landing() {
    const {user} = useContext(AuthUserContext);
    const [tickets,setTickets] = useState([])
    const nav = useNavigate()
    useEffect(()=>{
      async function getTickets(){
        try {
          const response = await axios.get('/api/tickets')
          console.log(response.data);
          setTickets(response.data)
        } catch (error) {
          console.log(error);
        }
      }
      getTickets()
      console.log("en");
    },[]);

    const handlePurchase = async(ticketId) =>{
      try {
        const res = await axios.post('api/orders',{ticketId},{headers:{Authorization:`Bearer ${user.userToken}`}});
        console.log(res.data);
        nav('/orders')
      } catch (error) {
        console.log(error);
      }
    }
  return (
    <div>
        {user ?
      <h2>Welcome User!!</h2> 
        :
      <h2>Welcome </h2> 
        }
        <div style={{display:'flex', flexDirection:'column',gap:'1rem', margin:'2rem'}}>
        <h3 >Ticket Dashboard</h3>
          <div><Link to={'/tickets/create'}>Create Ticket</Link><Link to={'/orders'}>Orders</Link></div>

          <div style={{display:'flex',flexWrap:'wrap',flex:'1 1 200px',gap:'1rem'}}>

          {
            tickets.map(ticket=>{
              return(
              <div key={ticket.id} style={{width:'200px', height:"150px", border:'1px solid black',borderRadius:'5px',padding:'2rem',textAlign:'left',display:'flex',flexDirection:'column',gap:'1rem',justifyContent:'center',alignItems:'center'}}>
                  <h3>{ticket.title}</h3>
                  <p>Rs.{ticket.price}</p>
                  {/* <p>By </p> */}
                  <div>
                  <button style={{border:'1px solid black',padding:'0.5rem 1rem'}} onClick={()=>handlePurchase(ticket.id)} disabled={ticket.orderID ? true :false} >Purchase</button>
                  {ticket.orderID && <p style={{fontSize:'8px'}}>Ticket is already purchased!</p>}
                  </div>

              </div>
              )
            })
          }
          </div>

          

        </div>
    </div>
  )
}

export default Landing