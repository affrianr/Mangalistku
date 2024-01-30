import { useNavigate } from "react-router-dom"
import { fetchDetail } from "../features/detailSlice"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import Swal from "sweetalert2";
import axios from '../config/instance'

export default function TableList({manga}){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const list = useSelector(state => {
        return state.detail.list
    })

    const loading = useSelector(state => {
        return state.detail.loading
    })
    console.log(manga, '========')    

    const handleDelete = (id) => {
        try {
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
              }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.delete(`/list/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.access_token}`
                        }
                    })
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                  }).then(result => {
                    if(result.value){
                        window.location = '/list'
                    }
                  });
                }
              });
        } catch (error) {
            errorHandler(error)
        }
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

    return(
        <>
              <div className="container-md">
            <h1>My List</h1>
            
                <table className="table" style={{ justifyContent: "center"}}>
                    <thead>
                        <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Category</th>
                        <th scope="col">Image</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    { manga.map((el, i) => {
                        return <tr key={el.id}>
                        <th scope="row">{el.id}</th>
                        <td>{el.title}</td>
                        <td>{el.type}</td>
                        <td><img src={el.imageUrl} alt="" style={{maxHeight: 100, maxWidth: 100}} /></td>
                        <td>
                            <button className="btn btn-warning m-1" onClick={()=> handleDelete(el.id)}>
                                <AiIcons.AiFillDelete />
                            </button>
                        </td>
                        </tr>
                    })}
                    </tbody>
                </table>     
        </div>     
        </>
    )
}