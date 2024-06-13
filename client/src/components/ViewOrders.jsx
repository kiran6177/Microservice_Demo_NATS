import React, { useContext, useEffect, useState } from 'react'
import { AuthUserContext } from '../store/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router';

function ViewOrders() {

    const {user} = useContext(AuthUserContext)
    const [orders,setOrders] = useState([]);
    const nav = useNavigate()

    useEffect(()=>{
        if(!user){
            nav('/login')
            return
        }
        async function getOrders(){
            try {
                const res = await axios.get('api/orders',{headers:{Authorization:`Bearer ${user.userToken}`}})
                console.log(res.data)
                setOrders(res.data)
            } catch (error) {
                console.log(error);
            }
        }
        getOrders()
    },[])

  return (
    <div style={{padding:'2rem'}}>
      <h3>Orders</h3>
      <div>
        <table style={{display:'table', width:'50vw' , border:'1px solid black'}}>
            <tbody>
            <tr key="head" style={{border:'1px solid black', backgroundColor:'#e0e0e0'}}>
                <th>Title</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            {
                orders.map(order=>{
                    return(
                        <tr key="1"  style={{border:'1px solid black',textAlign:'center' }}>
                            <td>{order.ticket.title}</td>
                            <td>{order.ticket.price}</td>
                            <td>{order.status}</td>
                            <td><button style={{padding:'0.2rem 0.6rem'}}>Cancel</button></td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default ViewOrders
