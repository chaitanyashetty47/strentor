
import { Card } from '@/components/ui/card';

const CourseDetailsSkeleton = () => {
  return (
    <div className="flex gap-8 max-w-4xl p-6">
      {/* Image skeleton */}
      <Card className="flex-1">
        <div className="w-full aspect-square rounded-lg bg-gray-200 animate-pulse" />
      </Card>
      
      {/* Content skeleton */}
      <div className="flex-1 space-y-6">
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse" />
        
        {/* Description skeleton - multiple lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
        
        {/* Level and duration skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        
        {/* Avatar circles skeleton */}
        <div className="flex gap-2">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" 
            />
          ))}
        </div>
        
        {/* Schedule details skeleton */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsSkeleton;