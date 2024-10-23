import Header from "@/components/Header";
import CourseCard from "@/components/CourseCard";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/lib/config";
import { Courses } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

const LoadingCourseCard = () => {
  return (
    <Card className="w-[320px] overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-[200px]" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function Home() {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/course/getall`);
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        console.log("error is: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow px-4 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {loading
              ? [...Array(6)].map((_, index) => (
                  <div key={`skeleton-${index}`} className="flex justify-center">
                    <LoadingCourseCard />
                  </div>
                ))
              : courses.map((course) => (
                  <div key={course.id} className="flex justify-center">
                    <CourseCard course={course} />
                  </div>
                ))}
          </div>
        </div>
      </main>
      <footer className="h-16" /> {/* Spacer at the bottom */}
    </div>
  );
}