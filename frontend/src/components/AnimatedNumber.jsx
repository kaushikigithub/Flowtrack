import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numericValue = Number(value) || 0;
    const controls = animate(count, numericValue, {
      duration: 1,
      ease: 'easeOut',
    });

    const unsubscribe = rounded.on('change', (latest) => setDisplayValue(latest));

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value]);

  return <motion.span>{displayValue}</motion.span>;
}

export default AnimatedNumber;