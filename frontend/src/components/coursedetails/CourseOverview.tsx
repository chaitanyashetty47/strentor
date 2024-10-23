// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Star, Globe, Clock, Users, Video } from 'lucide-react';
import { Courses } from "@/types/types";
import { Skeleton } from "../ui/skeleton";

interface CourseDeetsProps {
  course: Courses;
}


const CourseOverview = ({course}: CourseDeetsProps) => {
  if(!course){
    return <Skeleton className="w-10 h-10 "></Skeleton>
  }
  return (
    // <div className="bg-white p-6 mt-4 rounded-lg shadow">
    //   <h2 className="text-2xl font-bold mb-4">
    //     Become a Full Stack Web Developer using Flask, Python, HTML, CSS, and MongoDB! Fully updated for 2023 and beyond.
    //   </h2>
      
    //   <div className="flex items-center space-x-4 mb-4">
    //     <div className="flex items-center">
    //       <Star className="w-5 h-5 text-yellow-400 fill-current" />
    //       <span className="ml-1 font-bold">4.6</span>
    //       <span className="ml-1 text-gray-500">(6,921 ratings)</span>
    //     </div>
    //     <div>
    //       <span className="font-bold">47,771</span>
    //       <span className="ml-1 text-gray-500">students</span>
    //     </div>
    //     <div>
    //       <span className="font-bold">19.5 hours</span>
    //       <span className="ml-1 text-gray-500">total</span>
    //     </div>
    //   </div>

    //   <p className="text-sm text-gray-500 mb-4">Last updated April 2024</p>

    //   <div className="flex items-center space-x-2 mb-4">
    //     <Globe className="w-5 h-5" />
    //     <span>English</span>
    //     <span className="text-gray-500">English, Portuguese [Auto], 2 more</span>
    //   </div>

    //   <Card className="mb-6">
    //     <CardContent className="p-4">
    //       <h3 className="flex items-center text-lg font-semibold mb-2">
    //         <Clock className="w-5 h-5 mr-2" />
    //         Schedule learning time
    //       </h3>
    //       <p className="text-gray-600 mb-4">
    //         Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals. Set time aside to learn and get reminders using your learning scheduler.
    //       </p>
    //       <div className="flex space-x-2">
    //         <Button>Get started</Button>
    //         <Button variant="outline">Dismiss</Button>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <div className="grid grid-cols-2 gap-6">
    //     <div>
    //       <h3 className="font-semibold mb-2">By the numbers</h3>
    //       <ul className="space-y-1 text-sm text-gray-600">
    //         <li className="flex items-center">
    //           <Users className="w-4 h-4 mr-2" />
    //           Skill level: Intermediate Level
    //         </li>
    //         <li className="flex items-center">
    //           <Users className="w-4 h-4 mr-2" />
    //           Students: 47771
    //         </li>
    //         <li className="flex items-center">
    //           <Globe className="w-4 h-4 mr-2" />
    //           Languages: English
    //         </li>
    //         <li className="flex items-center">
    //           <Globe className="w-4 h-4 mr-2" />
    //           Captions: Yes
    //         </li>
    //       </ul>
    //     </div>
    //     <div>
    //       <h3 className="font-semibold mb-2">Lectures</h3>
    //       <ul className="space-y-1 text-sm text-gray-600">
    //         <li className="flex items-center">
    //           <Video className="w-4 h-4 mr-2" />
    //           183 lectures
    //         </li>
    //         <li className="flex items-center">
    //           <Clock className="w-4 h-4 mr-2" />
    //           19.5 total hours
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </div>
  
    <div className="flex flex-col bg-white p-4 rounded-lg shadow ">

      <span className="font-bold text-2xl"> {course.title}</span>
      <span className="font-extralight pt-6">{course.description}</span>

    </div>
  );
};

export default CourseOverview;