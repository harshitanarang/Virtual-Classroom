import React from 'react'
import { useEffect,useState } from 'react'
import axios from 'axios'

function StudentDetail() {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const [students,setStudents]=useState([]);

    useEffect(()=>{
        const fetchStudents = async()=>{
            try{
                const response = await axios.get(`${backendUrl}/api/v5/student-detail`);
                if(response.data.success){
                 setStudents(response.data.studentdetails);
                 console.log(response.data.studentdetails);
                }
            }
            catch(error){
                console.log("Error fetching the student details",error)
            }
        }
        fetchStudents();
    })

  return (
    <div className="container my-1 px-4 py-8">
     
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-violet-800 text-white text-left">
            <th className="px-6 py-3 text-sm font-semibold">Student Photo</th>
            <th className="px-6 py-3 text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-sm font-semibold">Phone No</th>
            <th className="px-6 py-3 text-sm font-semibold">Roll No</th>
            <th className="px-6 py-3 text-sm font-semibold">Batch</th>
            <th className="px-6 py-3 text-sm font-semibold">Branch</th>
            <th className="px-6 py-3 text-sm font-semibold">Father Name</th>
            <th className="px-6 py-3 text-sm font-semibold">Email</th>

          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
              } hover:bg-gray-200 transition-colors`}
            >
              
<img src={student.avatar} className='h-20 m-2 rounded-md' alt="" />
              <td className="px-6 py-4 text-gray-700">{student.name}</td>
              <td className="px-6 py-4 text-gray-700">{student.phoneNo}</td>
              <td className="px-6 py-4 text-gray-700">{student.rollNo}</td>
              <td className="px-6 py-4 text-gray-700">{student.batch} </td>
              <td className="px-6 py-4 text-gray-700">{student.branch} </td>
              <td className="px-6 py-4 text-gray-700">{student.fatherName} </td>
              <td className="px-6 py-4 text-gray-700">{student.email} </td>



            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>  )
}

export default StudentDetail
