import { Courses } from "@/types/types";
import { Card, CardContent , CardHeader, CardFooter} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from 'lucide-react';
import useTutor from "@/hooks/useTutor";

export default function AdminCourseCard({course}:{course:Courses}) {

  const {tutor, loading, error} = useTutor(course.createdById)


  return (
    <Link to={`/course/${course.title}/${course.id}`}>
    <Card className="w-[320px] overflow-hidden">
      
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={course.imageUrl}
            alt="Runner on a street"
            className="w-full h-[200px] object-cover"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-1">{course.title}</h2>
        <p className="text-sm font-semibold text-gray-600">{course.level} · {course.duration} weeks</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
          <div className="flex items-center space-x-2">
            {loading ? (
              <Skeleton className="w-10 h-10 rounded-full" />
            ) : error ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            ) : tutor ? (
              <img 
                src={tutor.avatarUrl} 
                alt={tutor.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">
                {loading ? 'Loading...' : error ? 'Error loading tutor' : tutor ? tutor.name.charAt(0).toUpperCase() + tutor.name.slice(1) : 'Unknown tutor'}
              </p>
              <p className="text-xs text-gray-500">Tutor</p>
            </div>
          </div>
        </CardFooter>
    </Card>
    </Link>
  )
}