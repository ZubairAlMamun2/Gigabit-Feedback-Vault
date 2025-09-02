import React from 'react'
import Navbar from '../component/Navbar'
import { Outlet } from 'react-router-dom'

const Authlayout = () => {
  return (
    <div>
        <header>
            <Navbar />
        </header>
        <main>
            <Outlet />
        </main>
        
    </div>
  )
}

export default Authlayout