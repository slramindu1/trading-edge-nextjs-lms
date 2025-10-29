import { buttonVariants } from "@/components/ui/button";
import { adminGetCourses } from "@/app/data/admin-get-courses";
import Link from "next/link"
import { AdminCourseCard } from "./_components/AdminCourseCard";


export default async function CoursesPage(){
    const data = await adminGetCourses();
    return(
       <>
       <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Topics</h1>


        <Link href="/admin/topics/create" className={buttonVariants()}>Create Topic</Link>
       </div>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-7">
        {/* <h1>Here you will see all of the courses</h1> */}
        {data.map((course)=>(
           <AdminCourseCard  key={course.id} data={course}/>
        ))}
       </div>
       </>
    )
}