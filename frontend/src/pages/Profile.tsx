import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BACKEND_URL } from "@/lib/config";
import { useEffect,useState } from "react";
import Header from '@/components/Header';
import { useUser } from "@/hooks/useUser";
import axios from "axios"

interface Course {
  id: string;
  title: string;
  instructor: string;
  imageUrl: string;
  level:string;
  duration:string;
}

const LearningDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {accessToken} = useUser();


  useEffect(() => {
      const fetchPurchasedCourses = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get<Course[]>(`${BACKEND_URL}/purchases/get`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
    
          setCourses(data);
          setError(null);
        } catch (err: any) {
          // Handle Axios-specific errors
          setError('An unexpected error occurred');
          setCourses([]);
        } finally {
          setLoading(false);
        }
      };
    
      fetchPurchasedCourses();
    }, [accessToken]);    



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Header/>
        <div className="text-red-500 mb-4">{error}</div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header/>

      <div className="bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">My learning</h1>
          <Tabs defaultValue="all-courses" className="w-full">
            <TabsList className="bg-transparent border-b border-gray-700">
              <TabsTrigger 
                value="all-courses"
                className="text-gray-300 hover:text-white data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-white"
              >
                All courses
              </TabsTrigger>
     
              <TabsTrigger 
                value="wishlist"
                className="text-gray-300 hover:text-white data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-white"
              >
                Wishlist
              </TabsTrigger>
              <TabsTrigger 
                value="archived"
                className="text-gray-300 hover:text-white data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-white"
              >
                Archived
              </TabsTrigger>
      
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        {courses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            You haven't purchased any courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Taught By: {course.instructor.charAt(0).toUpperCase() + course.instructor.slice(1)}
                  </p>
                  <div className="text-sm text-gray-500 mb-2">
                    Level: {course.level} • Duration: {course.duration} weeks
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = `/course/${course.title}/${course.id}`}
                  >
                    START COURSE
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningDashboard;