// import { useState, useEffect } from 'react';
// import axios from 'axios';

// interface VideoContent {
//   id: number;
//   title: string;
//   thumbnail: string;
//   description: string;
//   type: string;
// }


// const VideoSection  = () => {
//   const [video, setVideo] = useState<VideoContent | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchVideo = async () => {
//       try {
//         const { data } = await axios.get<VideoContent>('http://localhost:3000/content/13');
//         setVideo(data);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideo();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!video) {
//     return <div>No video found</div>;
//   }

//   return (
//     <div className="bg-transparent text-white rounded-xl p-4 mx-auto mt-8 shadow-lg max-w-6xl m-auto">
      
//       {/* Video playback section */}
//       <div className="relative aspect-video mb-4">
//         <video className="w-full h-full object-cover rounded-lg" controls>
//           <source src={video.thumbnail} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       </div>

//       {/* Video description */}
//       <div className="bg-transparent text-black bg-opacity-90 text-xl p-4 rounded-lg">
//         <p>{video.description}</p>
//       </div>
//     </div>
//   );
// };

// export default VideoSection;
// VideoSection.tsx
import { useRecoilValue } from 'recoil';
import { selectedVideoState } from '../../recoil/atoms';

const VideoSection = () => {
  const video = useRecoilValue(selectedVideoState);

  if (!video) {
    return <div>No video selected</div>;
  }

  return (
    <div className="bg-transparent text-white rounded-xl p-4 mx-auto mt-8 shadow-lg max-w-6xl m-auto">
      {/* Video playback section */}
      <div className="relative aspect-video mb-4">
        {video.thumbnail ? (
          <video className="w-full h-full object-cover rounded-lg" controls>
            <source src={video.thumbnail} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div>No video available</div>
        )}
      </div>

      {/* Video description */}
      <div className="bg-transparent text-black bg-opacity-90 text-xl p-4 rounded-lg">
        <p>{video.description}</p>
      </div>
    </div>
  );
};

export default VideoSection;
