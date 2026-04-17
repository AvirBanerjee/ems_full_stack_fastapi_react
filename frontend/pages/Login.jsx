import React from 'react'
import { useState } from 'react'
import  { login} from '../auth/auth'
import {useNavigate} from 'react-router-dom'

function Login() {
  const [form,setForm]=useState({email:"",password:""})
  const navigate=useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    await login(form)
    navigate('/dashboard')
  }


  return (
    <form onSubmit={handleSubmit}>
       <input type="text" placeholder='E-Email' onChange={e=>setForm({...form,email:e.target.value})} />
       <input type="password" placeholder='password' onChange={e=>setForm({...form,password:e.target.value})}/>
       <button>Login</button>
    </form>
  )
}

export default Login
