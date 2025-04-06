import React from 'react'
import SubjectManager from '../Utils/SubjectManager'
import ClassFees from '../Utils/ClassFees'
import AdminViewStudentAttendance from '../Utils/AdminViewStudentAttendance'

const DashBoard = () => {
  return (
    <div>

   
    <div className="flex justify-center items-center min-h-screen">
      
    <SubjectManager/>
      <ClassFees/>
      
    </div>
   
    </div>
  )
}

export default DashBoard
