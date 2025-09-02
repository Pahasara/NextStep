import { useState, useEffect } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  animationType?: 'slideUp' | 'scale' | 'glow';
}

const AnimatedText = ({ 
  text, 
  className = "", 
  delay = 0, 
  duration = 0.8,
  staggerDelay = 0.05,
  animationType = 'slideUp'
}: AnimatedTextProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const letters = text.split('').map((char, index) => {
    const isSpace = char === ' ';
    return {
      char: isSpace ? '\u00A0' : char, // Use non-breaking space for spaces
      delay: index * staggerDelay,
      isSpace
    };
  });

  const getAnimationClasses = () => {
    const baseClasses = "inline-block transition-all ease-out";
    
    if (!isVisible) {
      switch (animationType) {
        case 'slideUp':
          return `${baseClasses} opacity-0 translate-y-8 scale-95`;
        case 'scale':
          return `${baseClasses} opacity-0 scale-0`;
        case 'glow':
          return `${baseClasses} opacity-0 translate-y-8 scale-95 filter blur-sm`;
        default:
          return `${baseClasses} opacity-0 translate-y-8 scale-95`;
      }
    } else {
      switch (animationType) {
        case 'slideUp':
          return `${baseClasses} opacity-100 translate-y-0 scale-100`;
        case 'scale':
          return `${baseClasses} opacity-100 scale-100`;
        case 'glow':
          return `${baseClasses} opacity-100 translate-y-0 scale-100 filter blur-0`;
        default:
          return `${baseClasses} opacity-100 translate-y-0 scale-100`;
      }
    }
  };

  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className={getAnimationClasses()}
          style={{
            transitionDelay: `${letter.delay}s`,
            transitionDuration: `${duration}s`
          }}
        >
          {letter.char}
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;
