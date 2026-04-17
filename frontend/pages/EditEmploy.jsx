import React from 'react'
import { useState,useEffect } from 'react'
import {useNavigate,useParams} from 'react-router-dom'
import API from '../api/axios'
function EditEmploy() {
    const id=useParams()
    const navigate=useNavigate()

    const [form,setForm]=useState(null)

    useEffect(()=>{
        API.get(`/employ/${id}`).then(res => setForm(res.data))

    },[id])

    const handleSubmit=async(e)=>{
        e.preventDefault()
        await API.put(`/employ/${id}`,form)
        navigate('/employs')
    }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={form.fullname} onChange={e=>setForm({...form,fullname:e.target.value})} />
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input type='Number' value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} />
        <input type='Number' value={form.completed} onChange={e=>setForm({...form,completed:e.target.value})} />
        <input  value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
        <input type='checkbox'  checked={form.description} onChange={e=>setForm({...form,isOnProject:e.target.value})} />

        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}></textarea>
        
        <button>update</button>
      </form>
    </div>
  )
}

export default EditEmploy
