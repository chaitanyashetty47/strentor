import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from  '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Courses } from "@/types/types";
import { User } from "@/types/types";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BACKEND_URL } from "@/lib/config";
import { useUser } from '@/hooks/useUser';

interface CourseDeetsProps {
  course: Courses;
  tutor?: User;
  tutorLoading: boolean;
  isEnrolled: boolean;
  loading: boolean;
}

const CourseDeets = ({ course, tutor, tutorLoading, isEnrolled, loading }: CourseDeetsProps) => {
  const navigate = useNavigate();
  const [joining, setJoining] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const {user , accessToken} = useUser();

  const userId = user?.id;

  const handleJoinCourse = async () => {
    try {
      setJoining(true);
  
      // Implement the API call to join the course
      const response = await axios.post(
        `${BACKEND_URL}/purchases/course/${course.id}/join`,
        {
          UsersId: userId,
          courseId: course.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.status === 201) { // Use 201 for successful creation
        // Handle success (e.g., reload the page or update UI)
        console.log(`Successfully joined the course: ${course.title}`);
        navigate(`/course/${course.id}/detail`);
      }
    } catch (error) {
      console.error(`Error joining course: ${error}`);
    } finally {
      setJoining(false);
      setShowDialog(false); // Close the dialog after attempting the join
    }
  };
  

  return (
    <div className="flex gap-8 max-w-4xl p-6">
      <Card className="flex-1">
        <img
          src={course.imageUrl}
          alt="Stretching exercise demonstration"
          className="rounded-lg bg-sky-50 w-full h-full object-fit"
        />
      </Card>

      <div className="flex-1 space-y-3">
        <h2 className="text-2xl font-bold">{course.title}</h2>

        <p className="text-gray-700">
          {course.description}
        </p>

        <div className="text-sm font-semibold">{course.level} • {course.duration} weeks</div>

        {!tutorLoading && tutor && (
          <div className="flex items-center gap-2 mt-4">
            <img src={tutor.avatarUrl} alt={tutor.name} className="w-12 h-12 rounded-full" />
            <div>
              <h3 className="text-lg font-semibold">
                {tutor.name.charAt(0).toUpperCase() + tutor.name.slice(1)}
              </h3>
              <p className="text-sm text-gray-500">Instructor</p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-3">
        <Button
  onClick={() => {
    if (isEnrolled) {
      // Navigate directly to course content if the user is enrolled
      navigate(`/course/${course.id}/detail`);
    } else {
      // Show the dialog to join the course if the user is not enrolled
      setShowDialog(true);
    }
  }}
  disabled={loading || joining}
  className={`px-4 py-2 font-semibold rounded-md transition ${
    isEnrolled || loading || joining
      ? "bg-gray-400 "
      : "bg-purple-600 text-white hover:bg-purple-700"
  }`}
          >
            {loading || joining ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isEnrolled ? (
              "Go to Course Content"
            ) : (
              "Join Course"
            )}
          </Button>

        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogTitle>Join Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to join this course: <strong>{course.title}</strong>?
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleJoinCourse}
                disabled={joining}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                {joining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Yes, Join Course"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CourseDeets;
