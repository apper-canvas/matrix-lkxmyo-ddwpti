const SkeletonLoader = ({ count = 3, variant = 'card', className = '' }) => {
  const variants = {
    card: 'h-32 bg-white rounded-lg shadow-sm border border-gray-200 p-6',
    list: 'h-16 bg-white rounded-lg shadow-sm border border-gray-200 p-4',
    text: 'h-4 bg-gray-200 rounded',
    header: 'h-8 bg-gray-200 rounded'
  };

  const renderSkeleton = (index) => {
    if (variant === 'card') {
      return (
        <div key={index} className={variants.card}>
          <div className="animate-pulse space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      );
    }

    if (variant === 'list') {
      return (
        <div key={index} className={variants.list}>
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={index} className={`animate-pulse ${variants[variant]} ${className}`} />
    );
  };

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => renderSkeleton(index))}
    </div>
  );
};

export default SkeletonLoader;