import React from 'react'
import { NavList } from '../components/NavList';

const Navbar = () => {
  return (
    <>
      <div className="mx-auto max-w-screen-xl px-6 py-3">
        <div className="flex items-center justify-between text-blue-gray-900 border-0 rounded-lg p-8 shadow-lg">
          <p className='font-bold text-lg'>
            Ready To Work
          </p>
          <div className="hidden lg:block">
            <NavList />
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar;