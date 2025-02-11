import { useContext, useEffect, useState } from "react"
import { useLoaderData } from "react-router"
import { getDB } from "~/db/getDB"

export async function loader() {
  const db = await getDB()
  const employees = await db.all("SELECT * FROM employees;")

  return { employees }
}

export default function EmployeesPage() {
  
  const { employees } = useLoaderData()
  const [filteredEmployees, setFilteredEmployees] = useState(employees)
   const [search,setSearch] = useState("")
      const [sortBy,setSortBy] = useState("")
      const [minAge, setMinAge] = useState(18)
      const [maxAge, setMaxAge] = useState(99)
  
      const [minSalary, setMinSalary] = useState(1)
      const [maxSalary, setMaxSalary] = useState(20)

      const [onlyActive, setOnlyActive] = useState(false)
      const [department,setDepartment]=useState("")
  
      useEffect(() => {
        const fetchEmployees = async () => {
          console.log(minAge,maxAge,minSalary,maxSalary)
          const response = await fetch(`http://localhost:5000/api/employees?minSalary=${minSalary*1000}&maxSalary=${maxSalary*1000}&minAge=${minAge}&maxAge=${maxAge}&search=${search}&sortBy=${sortBy}${department?`&department=${department}`:""}${onlyActive?`&onlyActive=true`:""}`);
          const data = await response.json()
          setFilteredEmployees(data.employees);
        };
    
        fetchEmployees();
      }, [minAge, maxAge, minSalary, maxSalary, search, sortBy,onlyActive,department]);

    
    
  return (
    <div className="bg-secondary text-black  min-h-screen flex flex-col flex-wrap">
      <div className="containers flex flex-wrap  pt-3 pl-10 w-full mx-auto mb-4 justify-center sm:justify-around">
          <div id="left" className="w-full sm:w-[33.333%] border rounded-2xl p-4 flex flex-col items-center ">
              <h1 className="text-2xl font-extrabold">Search</h1>
              <input type="text" placeholder="Search" className="border block rounded-md p-1" onChange={(e)=>setSearch(e.target.value)} />

              <label htmlFor="sort" className=" text-2xl font-extrabold flex flex-col items-center mt-5">
                Sort by:
                <select name="sort" id="sort" className="border ml-3 mt-3 font-medium" onChange={(e)=>setSortBy(e.target.value)}>

                  <option value="">select</option>
                  <option value="birthday">Age</option>
                  <option value="salary">Salary</option>
                  <option value="start_time">Precedence</option>
                </select>
              </label>

              <h1 className="my-5 text-2xl font-extrabold">Filters:</h1>


              <label htmlFor="department">
                Department:
              <select name="department" id="department" onChange={(e)=>setDepartment(e.target.value)} className="border rounded-md ml-2">
                <option value="">All</option>
                <option value="HR">HR</option>
                <option value="Accounting">Accounting</option>
                <option value="Tech">Tech</option>
              </select>
              </label>
              


              <div className="w-64 p-4 bg-gray-100 shadow-md rounded-lg mt-3">
                <p className="text-sm font-medium text-gray-700 mb-5">Age: {minAge} - {maxAge}</p>
                <div className="relative flex flex-col items-center">
                  <input type="range" min="18"
                    max="99" value={minAge}
                    onChange={(e) => setMinAge(Math.min(Number(e.target.value), maxAge - 1))}
                    className="w-full absolute -bottom-1"/>
                  <input
                    type="range" min="18" max="99" value={maxAge}
                    onChange={(e) => setMaxAge(Math.max(Number(e.target.value), minAge + 1))}
                    className="w-full mt-[-12px] absolute bottom-0"/>
                </div>
              </div>

              <div className="w-64 p-4 bg-gray-100 shadow-md rounded-lg mt-3">
                <p className="text-sm font-medium text-gray-700 mb-5">Salary: {minSalary}k - {maxSalary}k</p>
                <div className="relative flex flex-col items-center">
                  <input type="range" min="1"
                    max="20" value={minSalary}
                    onChange={(e) => setMinSalary(Math.min(Number(e.target.value), maxSalary - 1))}
                    className="w-full absolute -bottom-1"/>
                  <input
                    type="range" min="1" max="20" value={maxSalary}
                    onChange={(e) => setMaxSalary(Math.max(Number(e.target.value), minSalary + 1))}
                    className="w-full mt-[-12px] absolute bottom-0"/>
                </div>
              </div>

              <label htmlFor="active" className=" mt-4">
                Only Active?
                <input type="checkbox" id="active" className="ml-3" onClick={()=>setOnlyActive(!onlyActive)}/>
              </label>
              
             
          </div>
          <div id="right" className="w-full sm:w-[66.666%] ">
            {filteredEmployees.map((employee: any) => (
              <div key={employee.id} className="pl-8 pt-3 flex justify-between">
                <ul>
                  <li>Employee #{employee.id}</li>
                  <ul>
                    <li>Full Name: {employee.full_name}</li>
                    <li>Department: {employee.department}</li>
                    <li>title: {employee.title}</li>
                    <li>salary: ${employee.salary}</li>
                    <li>email: {employee.email}</li>
                    <a href={`/employees/${employee.id}`} className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit">Show more</a>
                  </ul>
                </ul>
                {employee.image && (
                  <div className="my-5">
              
                      <img
                      src={`/uploads/${employee.image}`} 
                      alt="Employee Image"
                      className="w-32 h-32 object-cover rounded-full"
                    />
                </div>
          )}
                <hr />
              </div>
            ))}
          </div>
      </div>
        
      <hr />
      <ul className="containers flex justify-between mt-4  ">
        <li><a href="/employees/new"className="bg-black rounded-2xl text-secondary p-2  hover:opacity-85 active:opacity-75 ">New Employee</a></li>
        <li><a href="/timesheets/" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 ">Timesheets</a></li>
      </ul>
    </div>
  )
}
