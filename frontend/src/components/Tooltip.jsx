function Tooltip({ text, children }) {
  return (
    <div className="relative group inline-flex">
      {children}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none">
        {text}
      </span>
    </div>
  );
}

export default Tooltip;