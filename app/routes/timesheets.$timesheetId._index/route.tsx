import { useLoaderData,useParams } from "react-router"
import { getDB } from "~/db/getDB"

export async function loader() {
  
    const db = await getDB()
    const timesheets = await db.all("SELECT * FROM timesheets ")
  
    return { timesheets }
}

export default function TimesheetPage() {
  const { timesheets } = useLoaderData()
  const {timesheetId}=useParams()
  const timesheet = timesheets.find(tms => tms.id.toString() === timesheetId);
  return (
    <div className="text-black bg-secondary min-h-screen">
      <ul className="containers">
        <li>id: {timesheet.id}</li>
        <li>Start date: {timesheet.start_time}</li>
        <li>End Date: {timesheet.end_time}</li>
        <li>EmployeeID:{timesheet.employee_id}</li>
        <li>Description: {timesheet.description}</li>
      </ul>
      <hr />
      <ul className="flex justify-between containers">
        <li><a href="/timesheets" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit">Timesheets</a></li>
        <li><a href="/timesheets/new" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit">New Timesheet</a></li>
        <li><a href="/employees/" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit">Employees</a></li>
      </ul>
    </div>
  )
}
