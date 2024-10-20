import { Courses } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Bookmark } from 'lucide-react';

export default function AdminCard({course}:{course:Courses}){

  return (
    <Card className="w-full max-w-sm bg-blue-600 text-white overflow-hidden">
      <Link to={`/admin/course/${course.title}/${course.id}`}>
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 left-0 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-tr-lg" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/20 to-transparent rounded-bl-full" />
        
        <div className="relative z-10">
          <p className="text-sm mb-2">100xDevs</p>
          <h2 className="text-xl font-bold mb-4">{course.title}</h2>
          <p className="text-sm">{course.description}</p>
        </div>
      </CardContent>
      </Link>
      <div className="bg-blue-700 p-4 flex justify-between items-center">
        <h3 className="font-semibold truncate">{course.slug}</h3>
        {/* <button className="text-white hover:text-blue-200">
          <Bookmark className={isBookmarked ? "fill-current" : ""} />
        </button> */}
      </div>
    </Card>
  )

}