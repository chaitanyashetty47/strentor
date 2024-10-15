import React,{useState} from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import bgImg from "../assets/bg-strentor.jpg";
import tutor from "../assets/tutor.jpg";
import CourseDetails from '../components/CourseDetails';
import Testimonials from '../components/Testimonials';
import Instructor from '../components/Instructor';


export default function Course() {
 
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/placeholder.svg" alt="Logo" className="w-10 h-10 mr-4" />
            <input
              type="text"
              placeholder="Search courses..."
              className="border rounded-md px-4 py-2 w-64"
            />
          </div>
          <nav className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">English</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Notifications</a>
            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImg}
            alt="Background"
            className="w-full  object-cover opacity-50"
          />
        </div>

        {/* Course Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Preparation for Job Interviews</h1>
            <div className="flex items-center space-x-2">
              <img src={tutor} alt="Instructor" className="w-10 h-10 rounded-full" />
              <span className="text-gray-600">Instructor: Jane Doe</span>
            </div>
            <p className="text-gray-600 mt-2">60,887 already enrolled</p>
          </div>

          {/* Course Details Card */}
          <CourseDetails/>

          {/* Testimonials Section */}
          <Testimonials/>

          
          {/* instructor */}
          <Instructor/>
        </div>
        
      </main>
    </div>

  );
}

