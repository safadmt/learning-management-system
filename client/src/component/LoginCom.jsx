import {Link} from 'react-router-dom';


const LoginCom = ({handlesubmit, handlechange, info}) => {
    const handleChange = (e)=> {
        handlechange(e)
    }
    const handleSubmit = (e)=> {
        handlesubmit(e)
    }
    return (
        <div>
            
        <div className='p-5 md:w-6/12 sm:w-12 m-auto mt-20 '>
          <div className="font-bold  text-2xl text-center">Login</div>
          <form onSubmit={handleSubmit} className="text-gray-400">
          
          
            <input type='email' name='email' value={info.email} placeholder="Email"
              className='block px-4 py-1 w-full text-2xl border-b-4  border-slate-300 mb-4 pb-2'
              onChange={handleChange} />

         
            <input type='password' name='password' value={info.password} placeholder="Password"
              className='block px-4 py-1 w-full text-2xl border-b-4 border border-slate-300 mb-4 pb-2'
              onChange={handleChange} />
            <input type='submit' className='block text-2xl px-4 py-1 w-full bg-blue-600 text-white' />
          </form>
         <Link to={'/forgot-password'} className='text-blue-500'>Forgot password ? </Link>
          <span className='block'>Don't have an account ? <Link to={'/signup'} className='text-blue-500'>Signup</Link></span>
        </div>
     
        </div>
    )
}

export default LoginCom;