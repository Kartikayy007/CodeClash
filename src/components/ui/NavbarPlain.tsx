'use client'

import React from 'react'
import Image from 'next/image'
import { Settings, House } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className='relative bg-[#10141D] z-50'>
      <div className='flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex items-center gap-4'>
          <Image
            src="/logo.svg"
            alt="Code Clash"
            width={162}
            height={40}
            priority
          />
        </div>

        <div className='flex items-center gap-4'>
          <button className='flex items-center gap-6'>
            {pathname === '/dashboard' ? (
              <Settings 
                size={30} 
                color='white' 
                className="hover:rotate-90 transition-transform duration-300"
                onClick={() => router.push('/settings')}
              />
            ) : (
              <>
                <House 
                  size={30} 
                  color='white' 
                  onClick={() => router.push('/dashboard')}
                />
                <Settings 
                  size={30} 
                  color='white' 
                  className="hover:rotate-90 transition-transform duration-300"
                  onClick={() => router.push('/settings')}
                />
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
