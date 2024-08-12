import crypto from 'crypto'

export const isLearningContentEmpty = (value)=> {
    if (value.replace(/<(.|\n)*?>/g, '').trim().length === 0 && !value.includes("<img")) {
       return true;
     }
       return false;
}


export const getRandomNumber = ()=> {
  const buffer = crypto.randomBytes(4);
  console.log(buffer)
}

getRandomNumber()