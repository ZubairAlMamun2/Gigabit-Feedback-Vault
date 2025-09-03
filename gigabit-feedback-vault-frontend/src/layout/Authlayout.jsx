import React from 'react'
import Navbar from '../component/Navbar'
import { Outlet } from 'react-router-dom'

const Authlayout = () => {
  return (
    <div>
            <Outlet /> 
    </div>
  )
}

export default Authlayout