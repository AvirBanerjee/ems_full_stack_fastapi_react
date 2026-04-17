import React from 'react'
import Navbar from '../components/Navbar'
import API from '../api/axios'
import { useState,useEffect } from 'react'
function Dashboard() {
    const[data,setData] =useState(null)
    useEffect(()=>{
        API.get("/dashboard")
    })
  return (
    <div>
      <Navbar/>
      <h1>{}</h1>
    </div>
  )
}

export default Dashboard
