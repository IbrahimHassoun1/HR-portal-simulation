import { useLoaderData } from "react-router";
import { useState,useEffect } from "react";
import { getDB } from "~/db/getDB";

import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
 
import '@schedule-x/theme-default/dist/index.css'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'



export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  if (timesheetsAndEmployees.length === 0) {
    return <div className="text-black text-5xl">
      No timesheets available
      <ul className="flex justify-between">
        <li><a href="/timesheets/new" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit">New Timesheet</a></li>
        <li><a href="/employees" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit">Employees</a></li>
      </ul>
      </div>; 
  }
  const [date,time] = timesheetsAndEmployees[0].start_time.split("T")
  

  const [view,setView] = useState("table")
  const scheduleData =  timesheetsAndEmployees.map((timesheet: any) => {
      const [startdate, starttime] = timesheet.start_time.split("T");
      const [enddate, endtime] = timesheet.end_time.split("T");
      
      return {
        id: timesheet.id,
        title: "blblb",
        start: `${startdate} ${starttime}`,
        end: `${enddate} ${endtime}`,
        description: timesheet.description,
        _options: {
          disableDND: false,
          disableResize: false,
        }
      };
    })


  const eventsService = useState(() => createEventsServicePlugin())[0]

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: scheduleData,
    plugins: [eventsService,createDragAndDropPlugin(30),createResizePlugin()],
    isResponsive:true,
    isDark:true,
    
    
  })
  useEffect(() => {
   
    eventsService.getAll()
  }, [eventsService])



  

  return (
    <div className="text-black bg-secondary min-h-screen">
    <div className="containers">
      <div className="flex justify-between ">
        <button className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit cursor-pointer" onClick={(e)=>setView("table")}>Table View</button>
        <button className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit cursor-pointer" onClick={(e)=>setView("calendar")}>Calendar View</button>
      </div>
    
      {view==="table" ? (
        <div>
          {
          timesheetsAndEmployees.map((timesheet: any) => (
            <div key={timesheet.id}>
              <ul>
                <li>Timesheet #{timesheet.id}</li>
                <ul>
                  <li>Employee: {timesheet.full_name} (ID: {timesheet.employee_id})</li>
                  <li>Start Time: {timesheet.start_time}</li>
                  <li>End Time: {timesheet.end_time}</li>
                  <li>Description: {timesheet.description}</li>
                  <li><a href={`/timesheets/${timesheet.id}`} className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit">Show More</a></li>
                <hr />
                </ul>
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div>
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
      )}
      <hr />
      <ul className="flex justify-between">
        <li><a href="/timesheets/new" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit">New Timesheet</a></li>
        <li><a href="/employees" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75 my-2 block w-fit">Employees</a></li>
      </ul>
      </div>
    </div>
  );
}
