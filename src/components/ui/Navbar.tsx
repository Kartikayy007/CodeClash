import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Settings } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center px-8 py-4'>
      <div className='flex items-center gap-4'>
        <Image
        src="/logo.svg"
        alt="Code Clash"
        width={162}
        height={40}
        priority
      />
      </div>

      <ul className='flex items-center gap-12 text-base font-bold'>
        <li>
          <Link href="/dashboard"> 
            Home
          </Link>
        </li>
        <li>
          <Link href="/leaderboard">
            Leaderboard
          </Link>
        </li>
        <li>
          <Link href="/performance">
            Performance
          </Link>
        </li>
        <li>
          <Link href="/matches">
            Matches/Contest
          </Link>
        </li>
        <li>
          <Link href="/profile">
            Profile
          </Link>
        </li>
      </ul>

      <button className='flex items-center gap-4'>
        <Settings size={30} className="hover:rotate-90 transition-transform duration-300" />
      </button>
    </nav>
  )
}

export default Navbar
