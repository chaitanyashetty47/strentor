import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { Star } from "lucide-react";
import turfImg from "../assets/turf-img.png";

export default function CourseCard() {
  const rating = 4; // This could be a prop or state

  return (
    <Card className="w-full max-w-sm overflow-hidden cursor-pointer transition duration-200 transform hover:scale-[1.02]">
      
      <Link to={`/course`}></Link>
      <div className="flex flex-col h-full ">
        <div className="h-48 overflow-hidden">
          <img
            src={turfImg}
            alt="Turf Cover Image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-violet-600 font-semibold mb-2">Introduction to Data Structures</span>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={16}
                className={index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
              />
            ))}
          </div>
          <div className="mt-auto">
            <span className="text-gray-500">4 weeks, Intermediate</span>
          </div>
        </div>
      </div>
    </Card>
  );
}