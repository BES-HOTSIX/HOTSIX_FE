'use client'

import { useState } from 'react'
import DropdownMenu from './dropdown-menu/DropdownMenu'
import NavbarImageBtn from './NavbarImageBtn'
import { navMenuType } from '@/constants/navbar'
import NavbarIconBtn from './NavbarIconBtn'

export default function Dropdown({ menu }) {
  const type = navMenuType[menu]
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleOutsideClick = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsMenuOpen(false)
    }
  }
  return (
    <div className='relative dropdown dropdown-end' onBlur={handleOutsideClick}>
      <div
        tabIndex={0}
        className={`btn btn-ghost btn-circle ${type.btnClass}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {menu === 'avatar' ? <NavbarImageBtn /> : <NavbarIconBtn menu={menu} />}
      </div>
      {isMenuOpen && (
        <div className='absolute right-4 z-10 mt-2 bg-white shadow-lg'>
          <DropdownMenu menu={menu} setIsMenuOpen={setIsMenuOpen} />
        </div>
      )}
    </div>
  )
}
