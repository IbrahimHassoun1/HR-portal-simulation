import { useLoaderData, Form, redirect, useActionData } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all('SELECT id, full_name FROM employees');
  return { employees };
}

import type { ActionFunction } from "react-router"
import { useState } from "react"


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const description = formData.get("description")

  let error=""
  if(start_time &&end_time&& start_time>end_time){
    error+="End time has to be AFTER start time"
    return {error}
  }
  if (!employee_id){
    error+="You have to choose an employee"
    return {error}
  }
  const db = await getDB();
  await db.run(
    'INSERT INTO timesheets (employee_id, start_time, end_time,description) VALUES (?, ?, ?,?)',
    [employee_id, start_time, end_time,description]
  );

  return redirect("/timesheets");
}

export default function NewTimesheetPage() {
  
  const { employees } = useLoaderData(); 
  const [selectedEmployeeID,setSelectedEmployeeID]=useState()


  const handleSelectChange = (e:any) =>{
    var newID = e.target.value
    setSelectedEmployeeID(newID)
  }


   const actionData = useActionData()
  const error = actionData?.error || ""
  return (
    <div className="text-black bg-secondary min-h-screen">
      <h1 className="text-center text-4xl font-extrabold pt-4">Create New Timesheet</h1>
      <Form method="post" className="containers flex flex-col gap-4 w-full items-center text-2xl">
        <div>
          
        </div>
        <div>
          <label htmlFor="start_time">Start Time</label>
          <input type="datetime-local" name="start_time" id="start_time" required />
        </div>
        <div>
          <label htmlFor="end_time">End Time</label>
          <input type="datetime-local" name="end_time" id="end_time" required />
        </div>
        <div className="flex  items-center">
          <label htmlFor="employee_id">Employee</label>
          <select name="employee_id" id="employee_id" className="border rounded-2xl ml-" onChange={e=>handleSelectChange(e)}> 
            <option value="">Select</option>
            {employees.map(employee=>{
            
              return <option key={employee.id} value={employee.id}>{employee.full_name}</option>
            })}
          </select>
          {selectedEmployeeID?<a href={`/employees/${selectedEmployeeID}`} className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit ml-5 text-sm">Employee details</a>:""}
          
        </div>
        <div>
         
          <textarea id="description" name="description" className="border h-56 w-full m-2  text-sm " placeholder="Describe your work"></textarea>
        </div>
        {error?<h1 className="text-red-800 text-2xl">{error}</h1>:""}
        <button type="submit" className="border rounded-2xl p-1 m-1 cursor-pointer">Create Timesheet</button>;
      </Form>
      <hr />
      <ul className="containers flex justify-between">
        <li><a href="/timesheets" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit">Timesheets</a></li>
        <li><a href="/employees" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit">Employees</a></li>
      </ul>
    </div>
  );
}
