
import { useNavigate } from 'react-router-dom'
import axios from '../config/instance'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchUser } from '../features/userSlice'

export default function Navbar(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(state => {
        return state.user.detail
    })

    useEffect(()=> {
        dispatch(fetchUser())
    },[])

    async function handleBuying(e){
        console.log('masuk handlebuying')
        try {
            e.preventDefault()
            const { data } = await axios({
                url: '/generate-midtrans-token',
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.access_token}`
                }
            })

            window.snap.pay(data.token, {
                onSuccess: function (result) {
                    subscribe()
                  /* You may add your own implementation here */
                  alert("payment success!"); console.log(result);
                }
              });
        } catch (error) {
            errorHandler(error)
        }
    }

    async function subscribe(){
        try {
            const { data } = await axios({
                url: '/subscription',
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.access_token}`
                }
            })
            
        } catch (error) {
            console.log(error)
        }
    }

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

    function handleLogout(e){
        e.preventDefault()
        localStorage.clear()
        navigate('/login')
    }
    return(
        <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Mangalistku</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item" onClick={()=> navigate('/')}>
                    <a className="nav-link active" aria-current="page">Home</a>
                    </li>
                    <li className="nav-item" onClick={()=> navigate('/list')}>
                    <a className="nav-link">List</a>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 profile-menu"> 
                {
                    user?.subscribe ? null : <button className='btn btn-primary' onClick={handleBuying}>Subscribe</button>
                }
                    <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <div className="profile-pic">
                            <img src={user.imgUrl} alt="Profile Picture" className='img-thumbail'/>
                        </div>
                    
                    {/* <!--  <i className="fas fa-user"></i> --> */}
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li onClick={()=> navigate('/profile')}><a className="dropdown-item"><i className="fas fa-sliders-h fa-fw"></i> Account</a></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li onClick={handleLogout}><a className="dropdown-item" href="#"><i className="fas fa-sign-out-alt fa-fw"></i>Log Out</a></li>
                    </ul>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
        </>
    )
}