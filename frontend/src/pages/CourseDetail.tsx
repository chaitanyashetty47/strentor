import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Header from '../components/coursedetails/CourseHeader';
import VideoSection from '../components/coursedetails/VideoSection';
import CourseOverview from '../components/coursedetails/CourseOverview';
import CourseContentDropdown from './Content';
import { useParams } from 'react-router-dom';
// import { useRecoilValue } from 'recoil';
// import { courseState } from '@/recoil/atoms';
import { BACKEND_URL } from "@/lib/config";
import { Courses } from "@/types/types";

export default function CoursePage() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const {courseId} = useParams();
  const [course, setCourse] = useState<Courses>();
  //const course = useRecoilValue(courseState);

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/course/get/${courseId}`);
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <Header title= {course?.title || "Course Details"} />
      <VideoSection />

      <Button
        onClick={toggleSidePanel}
        className="fixed top-4 right-4 z-50"
        variant="outline"
      >
        <Menu className="h-4 w-4 mr-2" />
        {isSidePanelOpen ? '' : 'Content'}
      </Button>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <CourseContentDropdown courseId={parseInt(courseId!)} />
        </div>
      </div>

      <Tabs defaultValue="content" className="max-w-6xl mx-auto mt-4">
        <TabsList className="grid w-full grid-cols-4 bg-white">
          <TabsTrigger value="content">Course content</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>

        </TabsList>

        <TabsContent value="content">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            <p>Click the "Course Content" button in the top right to view the full course structure.</p>
          </div>
        </TabsContent>
        <TabsContent value="overview">
          <CourseOverview course = {course!}/>
        </TabsContent>

        <TabsContent value="announcements">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Announcements</h2>
            <p>Section Will Be Added Soon!</p>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <p>Section Will Be Introduced Soon!</p>
          </div>
        </TabsContent>

        {/* Add other TabsContent components for remaining tabs */}
      </Tabs>
    </div>
  );
}