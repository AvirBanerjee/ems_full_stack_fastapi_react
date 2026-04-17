import React from 'react'
import Navbar from '../components/Navbar'
import EmployCard from '../components/EmployCard'
import API from '../api/axios'
import { useState,useEffect } from 'react'

function Employs() {
  const [data,setData]=useState([])
  const fetchData=()=>{
    API.get("/employs").then(res=>setData(res.data))
  }
  useEffect(()=>{
    fetchData()
  },[])

  const handleDelete=async(id)=>{
    if(!window.confirm("Delete?")) return;
    await API.delete(`/employ/${is}`)
  }

  return (
    <div>
      <Navbar/>
      {
        data.map(emp=>(
            <EmployCard key={emp.id} onDelete={handleDelete}></EmployCard>
        ))
      }
    </div>
  )
}

export default Employs
