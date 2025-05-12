import React from 'react'
import MathTest from './tests/maths/page'
import StudentInfoForm from './student-info/page'
const deleteEntry = async()=>{
  try{
      await connectDB();
      await TestResult.deleteMany({});
      console.log("Deleted all Entries")
  }
  catch(err){
      console.log(err)
  }
  
}
const page = () => {
  return (
    <>
    <StudentInfoForm/>
    {
      
    }
    </>
  )
}

export default page
