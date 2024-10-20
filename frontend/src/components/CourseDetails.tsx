import { Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from 'react-router-dom';
import { usePurchases } from '@/hooks/usePurchases';


export default function CourseDetails() {
  const { purchases, loading, error } = usePurchases();
  const user = purchases;
  const { courseId } = useParams();

  const isEnrolled = () => {
    

    if (!user || !user.purchasedCourses) return false;
    return user.purchasedCourses.some(course => course.id === Number(courseId));
  };

  if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

  

  return (
    <Card className="bg-white shadow-lg max-w-3xl mb-8">
      <CardContent className="p-6">
        {/* ... (previous card content) ... */}
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
          {user ? (
            isEnrolled() ? (
              <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
                Check Out Course
              </button>
            ) : (
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Enroll for Free
              </button>
            )
          ) : (
            <button className="bg-gray-400 text-white px-6 py-2 rounded-full cursor-not-allowed">
              Sign In to Enroll
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
          
