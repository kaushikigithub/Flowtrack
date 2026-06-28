function SkeletonCard() {
  return (
    <div className="bg-white rounded-card border border-gray-100 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-card bg-gray-200" />
        <div className="w-14 h-5 rounded-full bg-gray-200" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-full" />
    </div>
  );
}

export default SkeletonCard;