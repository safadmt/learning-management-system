import {Link} from 'react-router-dom';

const SignupCom = ({error, success,handlesubmit, handlechange, info}) => {
    const handleChange = (e)=> {
        handlechange(e)
    }
    const handleSubmit = (e)=> {
        handlesubmit(e)
    }
    return (
        <div>
            
        <div className='p-5 md:w-6/12 sm:w-12 m-auto mt-20 '>
          <div className="font-bold  text-2xl text-center">Signup</div>
          <div className={error ? 'w-full px-4 py-1 text-red-700 text-center' :
           'w-full px-4 py-1 text-green-700 text-center'}>{error ? error : success}</div>
          <form onSubmit={handleSubmit} className="text-gray-400">
          
            <input type='text' name='first_name' value={info.name} placeholder="Name"
              className='block px-4 py-1 w-full text-2xl border-b-4 border-slate-300 mb-4 pb-2'
              onChange={handleChange} />
          
            <input type='email' name='email' value={info.email} placeholder="Email"
              className='block px-4 py-1 w-full text-2xl border-b-4  border-slate-300 mb-4 pb-2'
              onChange={handleChange} />

         
            <input type='password' name='password' value={info.password} placeholder="Password"
              className='block px-4 py-1 w-full text-2xl border-b-4 border border-slate-300 mb-4 pb-2'
              onChange={handleChange} />
            <input type='submit' className='block text-2xl px-4 py-1 w-full bg-blue-600 text-white' />
            <span>Already have an account ? <Link to={'/login'} className='text-blue-500'>Login</Link></span>
          </form>
          
        </div>
     
        </div>
    )
}

export default SignupCom;