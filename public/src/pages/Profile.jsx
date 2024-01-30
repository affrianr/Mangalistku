import axios from "../config/instance"
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../features/userSlice";


export default function Profile(){
    const image = new FormData();
    const dispatch = useDispatch()
    const [userForm, setUserForm] = useState({
        fullName: '',
        phoneNumber: '',
        imgUrl: '',

    })
    const [loading, setLoading] = useState(false)
    const user = useSelector(state => {
        return state.user.detail
    })
    
    useEffect(()=> {
       dispatch(fetchUser())
    }, [])

    // console.log(user)

    const navigate = useNavigate()
    console.log(userForm)
    
    async function handleSubmit(e){
        try {
            e.preventDefault()
            setLoading(true)
            
            if(!image.has("image")){
                const { data } = await axios({
                    url: "/update-profile",
                    method: "PUT",
                    data: {
                        fullName: userForm.fullName,
                        phoneNumber: userForm.phoneNumber,
                       
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.access_token}`
                    }
                })
            } else {
                await axios({
                    url: '/update-profile',
                    method: "PATCH",
                    data: image,
                    headers: {
                        'Authorization': `Bearer ${localStorage.access_token}`
                    }
                })

                await axios({
                    url: "/update-profile",
                    method: "PUT",
                    data: {
                        fullName: userForm.fullName,
                        phoneNumber: userForm.phoneNumber,
                       
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.access_token}`
                    }
                })

                
            }
            Swal.close()
            Swal.fire({
                title: "Profil updated",
                icon: "success"
              });
            navigate('/')
        } catch (error) {
            errorHandler(error)
        } finally {
            setLoading(false)
        }
    }

    function handleChange(e){
        const {name, value} = e.target
        setUserForm({...userForm, [name]: value})
    }

    function handleUpload(e){
        console.log(e.target.files)
        const file = e.target.files[0];
        image.append("image", file);
        console.log(image.has("image"))
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
                <h1>Edit Profile</h1>
            <div className="container-md text-center d-flex justify-content-center">
                <img src={user.imgUrl} className="rounded-circle mx-5 img-thumbnail" style={{height:"200px", width:"200px"}} />
                <br />
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                    <label>Full Name</label>
                    <input
                    className="form-control"
                    type="text"
                    label="Full Name"
                    name="fullName"
                    defaultValue={user.fullName}
                    style={{
                        width: 500,
                        maxWidth: '100%', }}
                    onChange={handleChange}></input>
                    </div>
                    <div className="mb-2">
                    <label>Phone Number</label>
                    <input
                    className="form-control"
                    name="phoneNumber"
                    label="Phone"
                    defaultValue={user.phoneNumber}
                    style={{
                        width: 500,
                        maxWidth: '100%', }} 
                    onChange={handleChange}></input>
                    </div>
                    <label>Profile Picture</label>
                    <div className="container-md text-center d-flex row justify-content-center">
                            <div className="input-group mb-3" style={{
                                
                                width: 500,
                                maxWidth: "100%"
                                                 }}>
                                <input type="file" className="form-control" onChange={handleUpload}/>
                            </div>
                    </div>

                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
            </div>
        </>
    )
}