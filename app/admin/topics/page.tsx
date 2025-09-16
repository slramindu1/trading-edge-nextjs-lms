import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"


export default function CoursesPage(){
    return(
       <>
       <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Topics</h1>


        <Link href="/admin/topics/create" className={buttonVariants()}>Create Topic</Link>
       </div>
       
       <div>
        <h1>Here you will see all of the courses</h1>
       </div>
       </>
    )
}