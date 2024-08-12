import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

function FormInput({formvalue,handleChange,handleSubmit}) {
  return (
    <div>
        <div className='md:w-8/12 mx-auto py-4' >
          <form className='mt-4' onSubmit={handleSubmit}>
            
            <label className='pt-2'>Highest level education *</label>
            <input type='text' name='highest_level_education' placeholder=''
              value={formvalue.highest_level_education} onChange={handleChange}
              className='px-2 pb-2 border-2 border-gray-400 text-xl w-full mb-2 rounded' />
            <label className='pt-2'>From in which subject you taken the highest level education *</label>
            <input type='text' name='education_subject' placeholder=''
              value={formvalue.education_subject} onChange={handleChange}
              className='px-2 pb-2 border-2 border-gray-400 text-xl w-full mb-2 rounded' />
            <label className='pt-2'>From which university you taken the highest level education *</label>
            <input type='text' name='university' placeholder=''
              value={formvalue.university} onChange={handleChange}
              className='px-2 pb-2 border-2 border-gray-400 text-xl w-full mb-2 rounded' />
            <label className='pt-2'>Institution/Company Name (Currently Working), if NOT working, please mention "Freelance" *</label>
            <input type='text' name='currently_work' value={formvalue.currently_work}
              onChange={handleChange}
              className='px-2 pb-2 border-2 border-gray-400 text-xl w-full mb-2 rounded' />
            <label className='py-2'>Subject area that your are qualified with</label>
            <input type='text' name='subject_area' placeholder='' value={formvalue.subject_area}
              onChange={handleChange}
              className='px-2 pb-2 border-2 border-gray-400 text-xl w-full mb-2 rounded' />
            <label className='pt-2'>How many years of expereince do you have</label>
            <input type='number' name='experience' min="0" placeholder='' value={formvalue.experience}
              onChange={handleChange}
              className='px-2 pb-2 border-2 border-gray-400 text-xl w-full mb-2 rounded' />
            <label htmlFor="" className='pt-2'>Explain about yourself</label>
            <textarea className='border-2 border-gray-400 w-full' rows={4} name='aboutyourself'
              value={formvalue.aboutyourself} onChange={handleChange} />
              
            <button type='submit' className='border-2 border-gray-500 px-4 mt-2 py-2 hover:bg-emerald-400 text-xl block w-full'>Submit</button>
          </form>
        </div>
      </div>
  )
}

export default FormInput