import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import CourseDeets from '../components/CourseDeets';
import Instructor from '../components/Instructor';
import CourseDetailsSkeleton from '@/components/skeleton/CourseDeetsSkeleton';
import useTutor from '@/hooks/useTutor';
import { usePurchases }from '@/hooks/usePurchases';
import { useSetRecoilState } from 'recoil';
import { courseState } from '@/recoil/atoms';
import { Courses } from "@/types/types";
import { BACKEND_URL } from "@/lib/config";


export default function Course() {
  const [course, setCourse] = useState<Courses>();
  const { courseId } = useParams();
  const { purchases, loading: purchasesLoading } = usePurchases();
 
  const setCourseDetails = useSetRecoilState(courseState);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/course/get/${courseId}`);
        const data = await response.json();
        setCourse(data);
        setCourseDetails(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [courseId, setCourseDetails]);

  // Use the useTutor hook to fetch tutor data
  const { tutor, loading: tutorLoading } = useTutor(course?.createdById!);

  // Check if the user is enrolled
  const isEnrolled = purchases?.purchasedCourses?.some(course => course.id === Number(courseId)) || false;

  return (
    <div>
      <Header />
      <div className='flex justify-center'>
        {course ? (
          <CourseDeets
            course={course}
            tutor={tutor}
            tutorLoading={tutorLoading}
            isEnrolled={isEnrolled}
            loading={purchasesLoading}
          />
        ) : (
          <CourseDetailsSkeleton />
        )}
      </div>
      <Instructor tutor={tutor} tutorLoading={tutorLoading} />
    </div>
  );
}
