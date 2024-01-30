import axios from "../config/instance"
import { useState } from "react";
import {TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";


export default function Register(){
    const [userForm, setUserForm] = useState({
        fullName: "",
        email:"",
        password: "",
        phoneNumber: ""
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    
    async function handleSubmit(e){
        try {
            e.preventDefault()
            setLoading(true)
            const { data } = await axios({
                url: "/register",
                method: "POST",
                data: userForm
            })
            navigate('/')
            Swal.close()
        } catch (error) {
            errorHandler(error)
        } finally {
            setLoading(false)
        }
    }

    if(loading){
        Swal.fire({
            title: 'Updating...',
            html: 'Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          });
    }

    function errorHandler(error){
        let text = ''
            if(error.response.data.err[0]){
                text = error.response.data.err[0]
            } else {
               text = error.message
            }
            Swal.fire({
                title: 'Error!',
                text: `${text}`,
                icon: 'error',
                confirmButtonText: 'Ok'
              })   
    }

    
    return (
        <>
            <div className="container-md mt-5 text-center">
                <h1>Ini halaman buat nambah User</h1>
                <br />

                <form onSubmit={handleSubmit}>
                    <TextField
                    type="text"
                    id="outlined-required"
                    label="Full Name"
                    sx={{
                        width: 500,
                        maxWidth: '100%', }}
                    onChange={(e)=> setUserForm({...userForm, fullName: e.target.value})}
                    />
                    <br />
                    <br />
                    <TextField
                    type="text"
                    id="outlined-required"
                    label="Email"
                    sx={{
                        width: 500,
                        maxWidth: '100%', }}
                    onChange={(e)=> setUserForm({...userForm, email: e.target.value})}
                    />
                    <br />
                    <br />
                    <TextField
                    type="password"
                    id="outlined-required"
                    label="Password"
                    sx={{
                        width: 500,
                        maxWidth: '100%', }}
                    onChange={(e)=> setUserForm({...userForm, password: e.target.value})}
                    />
                    <br />
                    <br />
                    <TextField
                    type="text"
                    id="outlined-required"
                    label="Phone Number"
                    sx={{
                        width: 500,
                        maxWidth: '100%', }}
                    onChange={(e)=> setUserForm({...userForm, phoneNumber: e.target.value})}
                    />
                    <br />
                    <br />   
                    <button className="btn btn-primary">Sign Up</button>
                </form>
            </div>
        </>
    )
}