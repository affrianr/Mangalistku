import { useDispatch, useSelector } from "react-redux";
import {fetchManga} from "../features/mangaSlice";
import { useEffect } from "react";
import Cards from '../components/Cards'


export default function Home(){
    const dispatch = useDispatch()
    const myManga = useSelector( state => {
        return state.manga.list
    })
    const loading = useSelector( state => {
        return state.manga.loading
    })

    useEffect(()=> {
        dispatch(fetchManga())
    }, [])

    if(loading){
        return <h1>Lodaing..............</h1>
    }

    return (
        <>
        
        <div className="container mt-5">
            <div className="d-flex justify-content-center row row-cols-1 row-cols-md-5 g-3">
            {
                myManga.map(el => {
                   return <Cards manga={el}  />
                })
            }

            </div>
        </div>
        </>
    )
}