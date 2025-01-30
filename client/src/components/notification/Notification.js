import React from 'react';

const Notification = ({ message, type }) => {
  const style = {
    padding: '10px 20px',
    borderRadius: '4px',
    margin: '10px 0',
    backgroundColor: type === 'success' ? '#4caf50' : '#f44336',
    color: 'white',
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000
  };

  return message ? <div style={style}>{message}</div> : null;
};

export default Notification;