export const isQuillEmpty = (value)=> {
  
  let cleanedValue = value.replace(/<(.|\n)*?>/g, "")
  
  // Trim leading and trailing whitespaces
  let trimmedValue = cleanedValue.trim()

  // Check if the trimmed value is empty and does not include <img
  if (trimmedValue.length === 0 && !value.includes("<img")) {
    return true
  }else{
    return false
  }
      
  
      
}




    