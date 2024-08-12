import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../qandans.css'

import { IoClose } from "react-icons/io5";


function React_Quill({value,setValue,placeholder}) {
  
 
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]
  

  return <ReactQuill theme="snow"
                    className='react-quill'
                    modules={modules}
                    formats={formats} value={value} onChange={setValue}
                    placeholder={placeholder}
                    >
        </ReactQuill>
      

}

export default React_Quill;