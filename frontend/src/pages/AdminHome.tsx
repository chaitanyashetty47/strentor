import { useState, useEffect } from "react";
import AdminHeader from "@/components/AdminHeader";
import AdminCard from "@/components/AdminCard";
import AddCourseForm from "@/components/adminupload/AddCourseForm";
import { BACKEND_URL } from "@/lib/config";
import { Courses } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { accessToken } = useUser();
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<any>(`${BACKEND_URL}/users/created`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCourses(data);
    } catch (error) {
      setError('An unexpected error occurred');
      setCourses([]);
      console.error("Error fetching Courses:", error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [refreshTrigger]);

  const handleAddCourse = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCourseAdded = () => {
    toast({
      title: "Course Added",
      description: `Your Course Has Been Added`,
      duration: 2000,
    })
    fetchCourses();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <AdminHeader />
        <div className="text-red-500 mb-4">{error}</div>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleAddCourse}
          >
            Add New Course
          </Button>
        </div>

        {!courses.length ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-xl text-gray-600">
              Get Started and Add a Course!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 justify-items-center">
            {courses.map((course) => (
              <AdminCard
                key={course.id}
                course={course}
                onUpdate={() => setRefreshTrigger(prev => prev + 1)}
              />
            ))}
          </div>
        )}

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Add New Course</DialogTitle>
            <AddCourseForm 
              onClose={handleCloseModal} 
              onCourseAdded={handleCourseAdded} 
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}