import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

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
            src="/placeholder.svg?height=400&width=1200"
            alt="Background"
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        {/* Course Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Preparation for Job Interviews</h1>
            <div className="flex items-center space-x-2">
              <img src="/placeholder.svg" alt="Instructor" className="w-10 h-10 rounded-full" />
              <span className="text-gray-600">Instructor: Jane Doe</span>
            </div>
            <p className="text-gray-600 mt-2">60,887 already enrolled</p>
          </div>

          {/* Course Details Card */}
          <Card className="bg-white shadow-lg max-w-3xl">
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
        </div>
      </main>
    </div>
  );
}