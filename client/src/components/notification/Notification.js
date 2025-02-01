import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({ message, type }) => {
  const [isShowing, setIsShowing] = useState(true);

  useEffect(() => {
    if (message) {
      setIsShowing(true);
      const timer = setTimeout(() => setIsShowing(false), 2800);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !isShowing) return null;

  return (
    <div className={`notification ${type}`} style={isShowing ? {} : { animation: 'slideOut 0.3s ease-out forwards' }}>
      {message}
    </div>
  );
};

export default Notification;