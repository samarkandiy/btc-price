import React, { useState, useEffect } from 'react';

const TypingIndicator = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 3) {
          return '';
        } else {
          return prevDots + '.';
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span className="typing-dots">{`Typing${dots}`}</span>;
};

export default TypingIndicator;