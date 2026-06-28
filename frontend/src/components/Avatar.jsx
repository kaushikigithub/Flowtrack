function Avatar({ name, size = 'md' }) {
  const initials = name
    ? name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  // Deterministic color based on the name, so the same person always gets the same color
  const colors = ['bg-primary-500', 'bg-accent-500', 'bg-amber-500', 'bg-rose-500', 'bg-blue-500'];
  const colorIndex = name
    ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    : 0;

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

export default Avatar;