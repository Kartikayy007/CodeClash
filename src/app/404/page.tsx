import React from 'react'
import LetterGlitch from '@/components/404page'
const page = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <h1 className='text-white z-10 text-4xl font-bold absolute top-50 left-50 '>
        PAGE NOT FOUND
      </h1>
      <LetterGlitch
        glitchColors={["#48105b", "#9632be", "#61b3dc"]}
        glitchSpeed={50}
        centerVignette={true}
        outerVignette={true}
        smooth={true}
      />
    </div>
  )
}

export default page
