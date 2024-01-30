import { useState } from 'react'
import { Provider } from 'react-redux'
import router from './router'
import { RouterProvider } from 'react-router-dom'
import store from './store'


function App() {
  
    return(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    )
}

export default App
