import { useNavigate } from "react-router-dom"


export default function Cards({manga}){
    const navigate = useNavigate()
    return(
        <>
            <a onClick={()=> navigate(`/details/${manga.node.id}`)}>
                <div className="col">
                    <div className="card mb-1" style={{ maxHeight: '45vh', maxWidth: '30vh'}}>
                    <img src={manga.node.main_picture.medium} className="card-img-top" style={{ height: '40vh'}}  alt="..."/>
                    </div>
                        <h5 className="card-title" style={{ fontSize: '1rem'}}>{manga.node.title}</h5>
                </div>
            </a>
        </>
    )
}