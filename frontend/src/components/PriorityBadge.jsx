function PriorityBadge({ priority }) {
  const styles = {
    low: 'bg-emerald-50 text-emerald-600',
    medium: 'bg-amber-50 text-amber-600',
    high: 'bg-red-50 text-red-600',
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[priority] || styles.medium}`}>
      {priority}
    </span>
  );
}

export default PriorityBadge;