import { useState } from "react";
import { Form, redirect, type ActionFunction, useActionData } from "react-router";
import { getDB } from "~/db/getDB";
import fs from "fs";
import path from "path";


const uploadPath = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadPath, { recursive: true });

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  
  const full_name = formData.get("full_name")
  const birthday = formData.get("birthday");
  const email = formData.get("email")
  const phone = formData.get("phone")
  const department = formData.get("department")
  const title = formData.get("title");
  const salary = formData.get("salary");
  const start_time = formData.get("start_time")
  const end_time = formData.get("end_time");
  const image = formData.get("image") as File | null;
  const cv = formData.get("cv") as File | null

  let error = "";

  if (birthday && typeof birthday === "string") {
    const birthDate = new Date(birthday);
    let age = new Date().getFullYear() - birthDate.getFullYear();
    const m = new Date().getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      error = "You must be at least 18 years old"
      return { error };
    }
  }

  if (salary && !isNaN(Number(salary)) && Number(salary) < 1000) {
    error = "The minimum wage is 1000 USD"
    return { error };
  }

  if (start_time && end_time && typeof start_time === "string" && typeof end_time === "string") {
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    if (endDate.getTime() < startDate.getTime()) {
      error = "end_time date must be AFTER start_time date";
      return { error };
    }
  }

  let imageName = null;
  if (image && image.size > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(image.type)) {
      error = "Invalid image type. Only JPG, JPEG, and PNG are allowed.";
      return { error };
    }
    imageName = `${Date.now()}_${image.name}`;
    const buffer = Buffer.from(await image.arrayBuffer())
    fs.writeFileSync(path.join(uploadPath, imageName), buffer)
  }

 
  let cvName = null
  if (cv && cv.size > 0) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(cv.type)) {
      error = "Invalid CV file type. Only PDF or DOCX are allowed."
      return { error };
    }
    cvName = `${Date.now()}_${cv.name}`;
    const buffer = Buffer.from(await cv.arrayBuffer());
    fs.writeFileSync(path.join(uploadPath, cvName), buffer);
  }

  
  const db = await getDB();
  await db.run(
    "INSERT INTO employees (full_name, birthday, email, phone, department, title, salary, start_time, end_time, image, cv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      full_name,birthday,email,phone,
      department,title,salary,start_time,end_time || null,
      imageName,
      cvName,
    ]
  );

  return redirect("/employees")
};


export default function NewEmployeePage() {
  const [isEmployed, setIsEmployed] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const actionData = useActionData();
  const error = actionData?.error || "";

  const handleChange = (e: any) => {
    setIsEmployed(!isEmployed);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      };
      reader.readAsDataURL(file); 
    }
  };

  return (
    <div className="bg-secondary text-black flex min-h-screen">
      <div className="container m-auto border rounded-2xl">
        <h1 className="text-4xl font-extrabold">Create New Employee</h1>
        <Form method="post" encType="multipart/form-data" className="flex flex-col w-fit m-auto">
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            required
            className="border ml-5 rounded-full"
          />

          <label htmlFor="birthday">Birthday</label>
          <input
            type="date"
            name="birthday"
            id="birthday"
            required
            className="border ml-5 rounded-full"
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="border ml-5 rounded-full"
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            required
            className="border ml-5 rounded-full"
          />

          <label htmlFor="department">Department</label>
          <select name="department" id="department" className="border rounded-2xl">
            <option value="HR">HR</option>
            <option value="Accounting">Accounting</option>
            <option value="Tech">Tech</option>
          </select>

          <label htmlFor="title">Job Title</label>
          <input type="text"name="title"
            id="title"
            required className="border ml-5 rounded-full"
          />

          <label htmlFor="salary">Salary (in USD)</label>
          <input
            type="number"name="salary"
            id="salary"required
            className="border ml-5 rounded-full"
          />

          <label htmlFor="start_time">Start Time</label>
          <input
            type="date"name="start_time"
            id="start_time"
  required
            className="border ml-5 rounded-full"
          />

          {!isEmployed?
            <>
              <label htmlFor="end_time">End Time</label>
              <input type="date"
            name="end_time"
                id="end_time"
                required className="border ml-5 rounded-full"
              />
            </>
          :""}

          <label htmlFor="condition">Still Works here</label>
          <input type="checkbox" id="condition" onChange={()=>{setIsEmployed(!isEmployed)}} />

        
          <label htmlFor="image">Employee Image</label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            className="border ml-5 rounded-full"
            onChange={handleImageChange} 
          />

          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="Image Preview" className="w-48 h-48 object-cover rounded-lg" />
            </div>
          )}

          <label htmlFor="cv">Upload CV</label>
          <input
            type="file"
            name="cv"
            id="cv"
            accept=".pdf,.docx"
            className="border ml-5 rounded-full"
          />

          {error && <div className="text-red-600">{error}</div>}
          <button type="submit" className="bg-black text-white rounded-full p-2 m-2 cursor-pointer hover:opacity-85 active:opacity-75">
            Create Employee
          </button>
        </Form>

        <hr />
        <ul className="flex justify-between p-3">
          <li>
            <a href="/employees" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75">Employees</a>
          </li>
          <li>
            <a href="/timesheets" className="bg-black rounded-2xl text-secondary p-2 hover:opacity-85 active:opacity-75" >Timesheets</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
