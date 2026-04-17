import React from 'react'
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'

function EmployDetails() {
    const id =useParams()
    const [emp,setEmp]=useState(null)

    useEffect(()=>{
        API.get(`/employ/${id}`).then(res => setEmp(res.data))
    },[id])

    if(!emp) return <p>Loading....</p>
  return (
    <div>
      <h1>{emp.fullname}</h1>
      <p>{emp.email}</p>
      <p>{emp.experience}</p>
      <p>{emp.completed}</p>
      <p>{emp.isOnProject  ? "On Project" : "Available"}</p>
      <p>{emp.description}</p>
    </div>
  )
}

export default EmployDetails
