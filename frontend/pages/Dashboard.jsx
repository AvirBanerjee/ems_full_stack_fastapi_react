import React from 'react'
import Navbar from '../components/Navbar'
import API from '../api/axios'
import { useState,useEffect } from 'react'
function Dashboard() {
    const[data,setData] =useState(null)
    useEffect(()=>{
        API.get("/dashboard").then(res=>setData(res.data),[])
    })
    if(!data) return <h1>Loading...</h1>
  return (
    <div>
      <Navbar/>
      <h1>{data.fullname}</h1>
      <p>Total Employs:{data.total_employs}</p>
    </div>
  )
}

export default Dashboard
