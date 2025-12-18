import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='flex flex-col min-h-screen text-center place-content-center'>
        <div className='border-1 max-w-md mx-auto p-5.5 rounded'>
            <h2 className='text-xl font-bold uppercase'> 404 Error, Page Not Found </h2>
            <Link to='/' className="text-blue-500 underline mt-2">
                Return to Home Page
            </Link>
        </div>
    </div>
  )
}

export default NotFound