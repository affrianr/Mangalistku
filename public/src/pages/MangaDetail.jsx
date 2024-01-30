import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fetchDetail } from "../features/detailSlice"
import { fetchUser } from "../features/userSlice"
import axios from "../config/instance"
import Swal from "sweetalert2"

export default function MangaDetail(){
    const { mangaId } = useParams()
    console.log(mangaId)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const details = useSelector(state => {
        return state.detail.list
    })

    const user = useSelector(state => {
        return state.user.detail
    })

    const loading = useSelector(state => {
        return state.detail.loading
    })

    useEffect(()=> {
        dispatch(fetchUser())
    }, [])

 
    useEffect(()=> {
        dispatch(fetchDetail(mangaId))
    }, [mangaId])
    
    

    async function addToList(){
        try {
            const {data} = await axios({
                url: `/list/add/${mangaId}`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.access_token}`
                }
            })
        dispatch(fetchUser())
        Swal.fire({
            title: `${data.title} added to list`,
            icon: "success"
          });
        } catch (error) {
            errorHandler(error)
        } finally {
            
        }
    }
    function errorHandler(error){
        let text = ''
        console.log(error)
            if(error.response){
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
    

    if(loading){
        return <h1>Loading......</h1>
    }
 
    return(
        <>
        <div class="container-md">

{/* <!-- Portfolio Item Heading --> */}
        <h1 class="my-4">{details?.title}</h1>
        

{/* <!-- Portfolio Item Row --> */}
<div class="row d-flex justify-content-around">

    <div class="col-md-4 d-flex flex-column">
        <img class="rounded float-start" src={details?.main_picture.large} style={{maxHeight: '80vh'}}/>
        <button className='btn btn-primary' onClick={addToList}>Add to List</button>
    </div>

    <div class="col-md-5">
        <h3 class="my-3">Synopsis</h3>
        <p>{details?.synopsis}</p>
        <h3 class="my-3">Manga Details</h3>
        <ul>
        <li>Rank: {details?.rank}</li>
        <li>Alternative Title: {details?.alternative_titles.synonyms}, {details?.alternative_titles.ja}</li>
        <li>Start Date: {details?.start_date}</li>
        <li>End Date: {details?.end_date}</li>
        <li>Status: {details?.status}</li>
        <li>Type: {details?.media_type}</li>
        </ul>
    </div>

</div>
{/* <!-- /.row --> */}

{/* <!-- Related Projects Row --> */}
<h3 class="my-4">Recommendation base on this manga:</h3>

<div class="row">

    {
        details?.recommendations ? details?.recommendations.map(el => {
            return <div class="col-md-2 col-sm-6 mb-4">
            <a onClick={()=> navigate(`/details/${el.node.id}`)}>
                <img class="rounded float-start" src={el.node.main_picture.medium} style={{maxHeight: '30vh'}}/>
            </a>
            </div>
        }) : null
    }

</div>
{/* <!-- /.row --> */}

</div>
{/* <!-- /.container --> */}
        </>
    )
}