import  { useState } from 'react';
import { CardContent } from "@/components/ui/card";
import { User } from '@/types/types';
import { Skeleton } from './Skeleton';

interface InstructorProps {
  tutor?: User; // Make tutor optional
  tutorLoading: boolean;
}

export default function Instructor({ tutor, tutorLoading }: InstructorProps) {
  const [showFullBio, setShowFullBio] = useState(false);

  if (tutorLoading) {
    return <Skeleton></Skeleton>;
  }

  if (!tutor) {
    return <div>No Instructor Details Available</div>;
  }

  const fullBio = tutor.aboutMe;
  const shortBio = fullBio.split('.')[0] + '.';

  return (
    <CardContent className="p-6">
      <h2 className="text-2xl font-bold mb-4">Get To Know Your Instructor</h2>
      <div className="flex items-start mb-4">
        <img src={tutor.avatarUrl} alt={tutor.name} className="w-24 h-24 rounded-full mr-4" />
        <div>
          <h3 className="text-xl font-semibold">{tutor.name}</h3>
          <p className="text-gray-600">{tutor.bio}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">
        {showFullBio ? fullBio : shortBio}
      </p>
      <button
        className="text-blue-600 hover:underline"
        onClick={() => setShowFullBio(!showFullBio)}
      >
        {showFullBio ? 'Show less' : 'Show more'}
      </button>
    </CardContent>
  );
}
