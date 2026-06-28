import AnimatedNumber from './AnimatedNumber';

function KPICard({ label, value, icon: Icon, accentColor = 'primary' }) {
  const accentClasses = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-500/10 text-accent-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  const isNumeric = !isNaN(Number(value));

  return (
    <div className="bg-white rounded-card shadow-soft border border-gray-100 p-5 flex items-center gap-4 hover:shadow-soft-lg transition-shadow duration-200 animate-fade-in">
      <div className={`p-3 rounded-card ${accentClasses[accentColor]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">
          {isNumeric ? <AnimatedNumber value={value} /> : value}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default KPICard;