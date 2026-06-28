function StatusBadge({ status }) {
  const styles = {
    backlog: 'bg-gray-100 text-gray-500',
    todo: 'bg-gray-100 text-gray-500',
    in_progress: 'bg-blue-50 text-blue-600',
    done: 'bg-emerald-50 text-emerald-600',
  };

  const labels = {
    backlog: 'Backlog',
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || styles.todo}`}>
      {labels[status] || status}
    </span>
  );
}

export default StatusBadge;