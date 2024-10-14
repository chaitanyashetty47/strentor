
import { Star } from 'lucide-react';
import { Card,CardContent } from "@/components/ui/card";

export default function CourseDetails() {
  return (
    <Card className="bg-white shadow-lg max-w-3xl mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Guided Project</h2>
                  <p className="text-gray-600">Learn, practice, and apply job-ready skills with expert guidance</p>
                </div>
                <div className="flex items-center justify-end">
                  <span className="text-2xl font-bold mr-2">4.4</span>
                  <Star className="w-6 h-6 fill-yellow-400 stroke-yellow-400" />
                  <span className="text-gray-600 ml-2">(709 reviews)</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Beginner level</h3>
                  <p className="text-gray-600">Recommended experience</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">1 hour</h3>
                  <p className="text-gray-600">Learn at your own pace</p>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Hands-on learning</h3>
                  <a href="#" className="text-blue-600 hover:underline">Learn more</a>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                  Enroll for Free
                </button>
              </div>
            </CardContent>
          </Card>
  );
}



          
