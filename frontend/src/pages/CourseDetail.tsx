import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Header from '../components/coursedetails/CourseHeader';
import VideoSection from '../components/coursedetails/VideoSection';
import CourseOverview from '../components/coursedetails/CourseOverview';
import CourseContentDropdown from './Content';

export default function CoursePage() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <Header title="Web Developer Bootcamp with Flask and Python in 2024" />
      <VideoSection />

      <Button
        onClick={toggleSidePanel}
        className="fixed top-4 right-4 z-50"
        variant="outline"
      >
        <Menu className="h-4 w-4 mr-2" />
        Course Content
      </Button>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <CourseContentDropdown courseId={2} />
        </div>
      </div>

      <Tabs defaultValue="content" className="max-w-6xl mx-auto mt-4">
        <TabsList className="grid w-full grid-cols-7 bg-white">
          <TabsTrigger value="content">Course content</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="qa">Q&A</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="learning-tools">Learning tools</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            <p>Click the "Course Content" button in the top right to view the full course structure.</p>
            {/* You can add a summary or preview of the course content here */}
          </div>
        </TabsContent>
        <TabsContent value="overview">
          <CourseOverview />
        </TabsContent>

        {/* Add other TabsContent components for remaining tabs */}
      </Tabs>
    </div>
  );
}