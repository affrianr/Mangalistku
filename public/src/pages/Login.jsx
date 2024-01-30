import { useEffect, useState } from "react"
import { redirect, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import api from '../config/instance'
import axios from 'axios'
import { TextField } from "@mui/material"
import queryString from 'query-string';
import { createNextState } from "@reduxjs/toolkit"

export default function Login(){
    const [rerender, setRerender] = useState(false)
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()
    const gClient_id = import.meta.env.VITE_CLIENT_ID_GOOGLE
    console.log(gClient_id, "<<<<<<< clien id google")

    async function handleSubmit(e) {
        // request POST Login ke server
        try {
            e.preventDefault()
            console.log(loginForm)
            const {data} = await api({
                url: '/login',
                method: 'POST',
                data: {
                    email: loginForm.email,
                    password: loginForm.password,
                }
            })

            localStorage.access_token = data.access_token
            navigate('/')
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: `${error.response.data.message}`,
                icon: 'error',
                confirmButtonText: 'Ok'
              })
            console.log(error)
        }

    }

    const handleCredentialResponse = async ({credential}) => {
        try {
            console.log(loginForm)
            const {data} = await api({
                url: '/auth/google',
                method: 'POST',
                headers: {
                    ['google-token'] : credential
                }
            })
            localStorage.access_token = data.access_token
            navigate('/')
        } catch (error) {
            next(error)
        }
    }
    

    const params = queryString.stringify({
        client_id: import.meta.env.VITE_CLIENT_ID_GITHUB,
        redirect_uri: 'http://localhost:5173/login',
        scope: ['read:user', 'user:email'].join(' '), // space seperated string
        allow_signup: true,
      });
      
    const githubLoginUrl = `https://github.com/login/oauth/authorize?${params}`;
      
    
    useEffect(()=> {
    const urlParams = queryString.parse(window.location.search);
    const code = urlParams.code
    console.log(`The code is: ${urlParams.code}`);
    console.log(localStorage.access_token, '-------- access_token')
    if(code && !localStorage.access_token){
        console.log('masuk kondisi login')
        async function getGitToken(){
            console.log('masuk getGitTOken')
            try {
                console.log('masuk getGitTOken di dalam try')
                const {data} = await api('/auth/github?code=' + code, {
                    method: "GET"
                })
                console.log(data, '==========')
                if(data.access_token){
                    localStorage.github_token = data.access_token
                    getUserData()
                    
                }
            } catch (error) {
                errorHandler(error)
            }
        }
        
        
        async function getUserData(){
            console.log('masuk getUserData')
            try {
               console.log('masukk try getuser') 
               console.log(localStorage.github_token)        
               const {data} = await api({
                    url: '/auth/github/token',
                    method: 'GET',
                    headers: {
                        'Authorization' : `Bearer ${localStorage.github_token}`
                    }
               })
               console.log(data, '<<<<< data dari github')
               localStorage.access_token = data.access_token
               navigate('/')
               
            } catch (error) {
                errorHandler(error)
            }
        }
        getGitToken()
        
       
    }
    
    },[])

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: gClient_id,
            callback: handleCredentialResponse
          });
          google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }  // customization attributes
          );
    },[])

    function errorHandler(error){
        let text = ''
        console.log(error)
            if(error.response.data.message){
                text = error.response.data.message
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

            <form onSubmit={handleSubmit}>
                <div className="container py-5 h-80">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card" style={{borderRadius: "1rem"}}>
                            <div className="card-body p-3 text-center">

                                <div className="mb-md-2 mt-md-4 pb-5">

                                <h2 className="fw-bold mb-2 text-uppercase text-3xl">Login</h2>
                                <p className="text-black-50 mb-5">Please enter your email and password</p>

                                <TextField
                                type="text"
                                id="outlined-required"
                                label="Email"
                                sx={{
                                    width: 500,
                                    maxWidth: '100%', }}
                                onChange={(e)=> setLoginForm({...loginForm, email: e.target.value})}
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
                                onChange={(e)=> setLoginForm({...loginForm, password: e.target.value})}
                                />
                                <br />
                                <br />
                                <button className="btn btn-primary btn-lg" type="submit">Login</button>
                                <br />

                                <div className="mt-2">
                                    <p><a className="text-black-50" href="#!">Don't have an account?</a></p>
                                    <button className="btn btn-outline-primary btn-lg text-black"  type="button" onClick={()=> navigate('/register')}>Sign Up</button>
                                </div>
                                <br />
                                <p>OR</p>
                                <div id="buttonDiv" className="btn w-0"></div>
                                </div>
                                <button className="btn btn-secondary"><a href={githubLoginUrl}>Github</a></button>
                            </div>
                            </div>
                        </div>
                        </div>
                </div>
            </form>
        </>
    )
}