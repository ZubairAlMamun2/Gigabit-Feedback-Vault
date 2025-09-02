import React, { useContext } from 'react'
import Navbar from './Navbar'
import { UserContext } from '../context/UserContext';

const AdminPanel = () => {
    const { user } = useContext(UserContext);
    console.log(user);
  return (
    <>
    <Navbar />
    <div>
        {/* {user.name} */}
    </div>
    </>
  )
}

export default AdminPanel