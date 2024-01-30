import { Outlet, redirect } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'

const AppLayout = () => {
    <>
        <Navbar />
        <Outlet />
    </>
}

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
        // loader: () => {
        //     if(localStorage.access_token){
        //         return redirect('/')
        //     }
        //     return null
        // }
    },
    {
        element: <AppLayout />,
        // loader: () => {
        //     if(!localStorage.access_token){
        //         return redirect('/login')
        //     }
        //     return null
        // },
        children: [
            {
                path: '/',
                element: <Home />
            }
        ]
    }
])

export default router