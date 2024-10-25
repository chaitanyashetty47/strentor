import { useState } from 'react';
import { CardContent } from "@/components/ui/card";
import { User } from '@/types/types';
import { Skeleton } from './Skeleton';
import { User as UserIcon } from 'lucide-react';

interface InstructorProps {
  tutor?: User;
  tutorLoading: boolean;
}

export default function Instructor({ tutor, tutorLoading }: InstructorProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (tutorLoading) {
    return <Skeleton />;
  }

  if (!tutor) {
    return <div>No Instructor Details Available</div>;
  }

  const fullBio = tutor.aboutMe;
  const shortBio = fullBio.split('.')[0] + '.';
  const shouldShowToggle = fullBio.length > 100;

  return (
    <CardContent className="p-6">
      <h2 className="text-2xl font-bold mb-4">Get To Know Your Instructor</h2>
      <div className="flex items-start mb-4">
        {imageError || !tutor.avatarUrl ? (
          <UserIcon className="w-24 h-24 text-gray-400 bg-gray-200 rounded-full mr-4" />
        ) : (
          <img
            src={tutor.avatarUrl}
            alt={tutor.name}
            className="w-24 h-24 rounded-full mr-4 object-cover"
            onError={() => setImageError(true)}
          />
        )}
        <div>
          <h3 className="text-xl font-semibold">{tutor.name}</h3>
          <p className="text-gray-600">{tutor.bio}</p>
        </div>
      </div>
      <div className="text-gray-700 mb-4">
        <span>{shouldShowToggle ? (showFullBio ? fullBio : shortBio) : fullBio}</span>
        {shouldShowToggle && (
          <button
            className="text-blue-600 hover:underline focus:outline-none ml-1 inline-flex items-center"
            onClick={() => setShowFullBio(!showFullBio)}
          >
            {showFullBio ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </CardContent>
  );
}