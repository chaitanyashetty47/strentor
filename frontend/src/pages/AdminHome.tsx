import { useState, useEffect } from "react";
import Header from "@/components/Header";
import AdminCard from "@/components/AdminCard";
import AddCourseForm from "@/components/adminupload/AddCourseForm";
import { BACKEND_URL } from "@/lib/config";
import { Courses } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function Home() {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/course/getall`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCourseAdded = () => {
    fetchCourses(); // Refresh the course list
  };

  return (
    <div>
      <Header />
      
      <div className="flex justify-end mt-4 mr-4">
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleAddCourse}
        >
          Add New Course
        </Button>
      </div>

      {!courses.length ? (
        <div className="flex justify-center items-center mt-12 text-xl text-gray-600">
          Get Started and Add a Course!
        </div>
      ) : (
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 justify-items-center">
          {courses.map((course) => (
            <AdminCard key={course.id} course={course} />
          ))}
        </div>
      )}

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogTitle>Add New Course</DialogTitle>
          <AddCourseForm onClose={handleCloseModal} onCourseAdded={handleCourseAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
