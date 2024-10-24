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
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search query
  const [filteredCourses, setFilteredCourses] = useState<Courses[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BACKEND_URL}/course/getall`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Received data is not an array');
        }
        
        setCourses(data);
        setFilteredCourses(data); // Initialize filteredCourses with all courses
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(error instanceof Error ? error.message : 'An error occurred while fetching courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses whenever the search query changes
  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearch={handleSearch} /> {/* Pass the handler */}
        <main className="flex-grow px-4 py-8">
          <div className="container mx-auto text-center">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-600">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} /> {/* Pass the handler */}
      <main className="flex-grow px-4 py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {loading ? (
              [...Array(6)].map((_, index) => (
                <div key={`skeleton-${index}`} className="flex justify-center">
                  <LoadingCourseCard />
                </div>
              ))
            ) : Array.isArray(filteredCourses) && filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div key={course.id} className="flex justify-center">
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No courses available</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="h-16" />
    </div>
  );
}
