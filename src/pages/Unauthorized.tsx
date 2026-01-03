import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <div className='flex flex-col min-h-screen text-center place-content-center'>
        <div className='border max-w-md mx-auto p-5.5 rounded'>
            <h2 className='text-xl font-bold uppercase'> 401 Error, You are not authorized </h2>
            <Link to='/auth/login' className="text-blue-500 underline mt-2">
                Please log in
            </Link>
        </div>
    </div>
  )
}

export default Unauthorized