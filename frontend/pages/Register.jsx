import React from 'react'
import { useState } from 'react'
import  { register} from '../auth/auth'

function Login() {
  const [form,setForm]=useState({fullname:"",email:"",password:""})

  const handleSubmit=async(e)=>{
    e.preventDefault();
    await register(form)
    alert("Registed")
  }


  return (
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Username' onChange={e=>setForm({...form,fullname:e.target.value})} />
       <input type="text" placeholder='E-Email' onChange={e=>setForm({...form,email:e.target.value})} />
       <input type="password" placeholder='password' onChange={e=>setForm({...form,password:e.target.value})}/>
       <button>Register</button>
    </form>
  )
}

export default Login
