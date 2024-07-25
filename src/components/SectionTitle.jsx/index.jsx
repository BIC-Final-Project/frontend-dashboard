import React from 'react'

const SectionTitle = ({children, title}) => {
  return (
    <div className='grid grid-cols-1 gap-5 bg-white px-8 py-6 rounded-md'>
        <div className=''>
            <h2 className='font-semibold text-xl'>{title}</h2>
        </div>
        <div className="divider my-0"></div>
        {children}
    </div>
  )
}

export default SectionTitle