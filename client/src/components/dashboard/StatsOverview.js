import React from 'react';
import './StatsOverview.css';

const StatsOverview = ({ habits }) => {
  const stats = {
    totalHabits: habits.length,
    activeDays: habits.reduce((max, h) => Math.max(max, h.current_streak), 0),
    totalXP: habits.reduce((sum, h) => sum + h.experience_points, 0),
    completionRate: habits.length ? 
      (habits.filter(h => h.complete).length / habits.length * 100).toFixed(0) : 0
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-value">{stats.totalHabits}</span>
        <span className="stat-label">Total Habits</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.activeDays}d</span>
        <span className="stat-label">Longest Streak</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.totalXP}</span>
        <span className="stat-label">Total XP</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.completionRate}%</span>
        <span className="stat-label">Completion Rate</span>
      </div>
    </div>
  );
};

export default StatsOverview;