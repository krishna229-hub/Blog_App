import React from 'react'
import { useRouteError } from 'react-router'

const ErrorComponent = () => {
    const {data,status,statusText} = useRouteError();
  return (
    <div className='text-center flex flex-col min-h-screen items-center justify-center'>
      <h1 className='text-red-600 text-2xl font-bold'>{data}</h1>
      <h1 className='text-red-500 text-xl font-semibold'>{status} - {statusText}</h1>
    </div>
  )
}

export default ErrorComponent