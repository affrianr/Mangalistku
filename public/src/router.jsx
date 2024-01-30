import { createBrowserRouter, Outlet, redirect } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import Register from "./pages/Register"
import MangaDetail from "./pages/MangaDetail"
import { fetchManga } from "./features/mangaSlice"
import Profile from "./pages/Profile"
import List from "./pages/List"

const AppLayout = () => (
    <>
        <Navbar />
        <Outlet />
    </>
)


const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
        loader: () => {
            if(localStorage.access_token){
                return redirect('/')
            }
            return null
        }
    },
    {
        path: '/register',
        element: <Register />,
        loader: () => {
            if(localStorage.access_token){
                return redirect('/')
            }
            return null
        }
    },
    {
        element: <AppLayout />,
        loader: ()=> {
            if(!localStorage.access_token){
                return redirect('/login')
            }
            return null
        },
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/details/:mangaId',
                element: <MangaDetail />
            },
            {
                path: '/profile',
                element: <Profile />
            },
            {
                path: '/list',
                element: <List />
            }
        ]
    }
    
    
])

export default router