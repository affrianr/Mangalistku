import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMangaList } from "../features/listSlice"
import TableList from "../components/TableList"

export default function List(){
    const dispatch = useDispatch()
    const mangaList = useSelector(state => {
        return state.mangaList.list
    })
    const loading = useSelector(state => {
        return state.mangaList.loadng
    })

    if(loading){
        return <h1>Loading.....</h1>
    }

    useEffect(()=>{
        dispatch(fetchMangaList())
    }, [])
    return (
        <>
            <TableList manga={mangaList}/>
        </>
    )
}