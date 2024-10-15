import Header from "@/components/Header"
import CourseCard from "@/components/CourseCard"
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/config";
import { Courses } from "@/types/types";



export default function Home (){
  const [courses, setCourses] = useState<Courses[]>([]);
  
  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/course/getall`); 
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return(
    <div>
       <Header />
       {/* Home
       <CourseCard/> */}
       <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )

}