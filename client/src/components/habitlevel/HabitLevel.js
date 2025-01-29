import React from 'react';
import './HabitLevel.css';

const HabitLevel = ({ experiencePoints }) => {
  // Calculate level based on experience points
  // Using a common RPG formula: level = floor(sqrt(exp/100))
  const calculateLevel = (exp) => Math.floor(Math.sqrt(exp/100));
  
  // Calculate experience needed for next level
  const getNextLevelExp = (level) => (level + 1) * (level + 1) * 100;
  
  const currentLevel = calculateLevel(experiencePoints);
  const nextLevelExp = getNextLevelExp(currentLevel);
  const currentLevelExp = currentLevel * currentLevel * 100;
  const progressToNextLevel = ((experiencePoints - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;

  return (
    <div className="habit-level">
      <div className="level-info">
        <span className="level-text">Level {currentLevel}</span>
        <span className="xp-text">{experiencePoints} / {nextLevelExp} XP</span>
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progressToNextLevel}%` }}
        />
      </div>
    </div>
  );
};

export default HabitLevel;