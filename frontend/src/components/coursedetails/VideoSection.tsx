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
          <video key={video.id} className="w-full h-full object-cover rounded-lg" controls>
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
