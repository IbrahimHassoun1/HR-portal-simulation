import { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router";
import { getDB } from "~/db/getDB";
import axios from 'axios'; 
export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT * FROM employees");

  return { employees };
}

export default function EmployeePage() {
  const { employeeId } = useParams();
  const { employees } = useLoaderData();
  const employee = employees.find(emp => emp.id.toString() === employeeId);

  const [full_name,setFull_name] = useState(employees.full_name)
  const [birthday,setBirthday] = useState(employees.birthday)
  const [email,setEmail] = useState(employees.email)
  const [phone,setPhone] = useState(employees.phone)
  const [department,setdepartment] = useState(employees.department)
  const [title,settitle] = useState(employees.title)
  const [salary,setsalary] = useState(employees.salary)
  const [start_time,setstart_time] = useState(employees.start_time)
  const [end_time,setend_time] = useState(employees.end_time)

  
 
  const updateUser = async () =>{
    const data = {
      id:employee.id,
      full_name:full_name,
      birthday:birthday,
      email:email,
      phone:phone,
      department:department,
      title:title,
      salary:salary,
      start_time:start_time,
      end_time:end_time
    }
    try {
      const response = await axios.post('http://localhost:5000/api/employees/update', data);
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <div className="bg-secondary text-black min-h-screen flex flex-col ">
      {employee ? (
        <div>
          <li className="text-5xl text-center">Employee #{employee.id}</li>
          <div className="flex justify-around my-5">
          {employee.image && (
            <div className="my-5">
              
              <img
                src={`/uploads/${employee.image}`} 
                alt="Employee Image"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
          )}
            <div id="left">
              <h1 className="text-3xl font-extrabold flex">Personal Details</h1>
              <ul className="flex flex-col gap-2">
                <li>Full Name: <input type="text" className="border rounded-sm" defaultValue={employee.full_name} onChange={(e)=>{setFull_name(e.target.value)}}/></li>
                <li>Birthday: <input type="date" className="border rounded-sm" defaultValue={employee.birthday} onChange={(e)=>{setBirthday(e.target.value)}}/></li>
                <li>Email: <input type="email" className="border rounded-sm" defaultValue={employee.email} onChange={(e)=>{setEmail(e.target.value)}}/></li>
                <li>Phone Number: <input type="text" className="border rounded-sm" defaultValue={employee.phone} onChange={(e)=>{setPhone(e.target.value)}}/></li>
              </ul>
            </div>
            <div id="right" >
              <h1 className="text-3xl font-extrabold flex">Professional Details</h1>
              <ul className="flex flex-col gap-2">
                <li>Department:<input type="text" className="border rounded-sm" defaultValue={employee.department} onChange={(e)=>{setdepartment(e.target.value)}}/> </li>
                <li>Title: <input type="text" className="border rounded-sm" defaultValue={employee.title} onChange={(e)=>{settitle(e.target.value)}}/></li>
                <li>Salary: $<input type="text" className="border rounded-sm" defaultValue={employee.salary} onChange={(e)=>{setsalary(e.target.value)}}/></li>
                <li>Start Time: <input type="date" className="border rounded-sm" defaultValue={employee.start_time} onChange={(e)=>{setstart_time(e.target.value)}}/></li>
                <li>End Time: {employee.end_time ? <input type="date" className="border rounded-sm" defaultValue={employee.end_time} onChange={(e)=>{setend_time(e.target.value)}}/> : "Still working"}</li>
                {employee.cv && (
            <div className="my-5 ml-auto">
              
              <a
                href={`/uploads/${employee.cv}`} 
                download
                className="text-blue-500 underline"
              >
                Download CV
              </a>
            </div>
          )}
              </ul>
            </div>
            
          </div>

      
          

        
          
        </div>
      ) : (
        <div>Failed to load employee details</div>
      )}
      <button  className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 w-20 mx-auto mb-5 cursor-pointer"  onClick={()=>updateUser()}>Update</button>
      <hr />
      <ul className="flex justify-between containers mt-4">
        <li>
          <a href="/employees" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75">
            Employees
          </a>
        </li>
        <li>
          <a href="/employees/new" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75">
            New Employee
          </a>
        </li>
        <li>
          <a href="/timesheets/" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75">
            Timesheets
          </a>
        </li>
      </ul>
    </div>
  );
}
