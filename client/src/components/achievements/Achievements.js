// src/components/achievements/Achievements.js
import React from 'react';
import './Achievements.css';

const Achievements = ({ habits }) => {
  const calculateAchievements = () => {
    return [
      {
        id: 'starter',
        name: 'Habit Starter',
        description: 'Created your first habit',
        unlocked: habits.length > 0,
        icon: '🌱'
      },
      {
        id: 'streak',
        name: 'Streak Master',
        description: 'Maintained a 7-day streak',
        unlocked: habits.some(h => h.current_streak >= 7),
        icon: '🔥'
      },
      {
        id: 'collector',
        name: 'XP Collector',
        description: 'Earned 1000 XP total',
        unlocked: habits.reduce((sum, h) => sum + h.experience_points, 0) >= 1000,
        icon: '⭐'
      },
      {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Created 5 habits',
        unlocked: habits.length >= 5,
        icon: '🏆'
      }
    ];
  };

  const achievements = calculateAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h3>Achievements ({unlockedCount}/{achievements.length})</h3>
      </div>
      <div className="achievements-grid">
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <span className="achievement-icon">{achievement.icon}</span>
            <h4 className="achievement-name">{achievement.name}</h4>
            <p className="achievement-description">{achievement.description}</p>
            {!achievement.unlocked && <div className="locked-overlay">🔒</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;