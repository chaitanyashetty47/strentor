import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from '../components/coursedetails/CourseHeader';
import VideoSection from '../components/coursedetails/VideoSection';
import CourseOverview from '../components/coursedetails/CourseOverview';

export default function CoursePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="Web Developer Bootcamp with Flask and Python in 2024" />
      <VideoSection />

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

        <TabsContent value="overview">
          <CourseOverview />
        </TabsContent>

        {/* Add other TabsContent components for remaining tabs */}
      </Tabs>
    </div>
  );
}