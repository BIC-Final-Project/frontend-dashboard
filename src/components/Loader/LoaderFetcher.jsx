import React from 'react'

const LoaderFetcher = ({classNames = 'h-28'}) => {
  return (
    <div className={`flex justify-center ${classNames}`}>
        <span className="loading loading-bars loading-lg"></span>
    </div>
  )
}

export default LoaderFetcher