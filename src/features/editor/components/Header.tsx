import { Maximize2 } from 'lucide-react'
import { Timer } from 'lucide-react'
import { ChevronLeft } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import LabelButton from '@/components/ui/LabelButton'

const Header = () => {
  return (
    <header className="flex items-center justify-between p-8">
          <div className="flex items-center gap-4 ">
            <Image
            src="/logo.svg"
            alt="Code Clash"
            width={162}
            height={40}
            priority
          />
        </div>

        <div className="flex justify-center items-center gap-4">
          <Timer size={20} />
          <div className="flex items-center gap-2 ">
            <span>00:00:00</span>
          </div>
        </div>

        <LabelButton variant="filled" customSize={{ width: '56px', height: '20px' }}>
          END
        </LabelButton>
        </header>
  )
}

export default Header
