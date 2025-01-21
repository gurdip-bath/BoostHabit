import React from 'react';
import { HabitProvider } from './context/habitcontext';
import Dashboard from './components/dashboard/dashboard';

function App() {
  return (
    <HabitProvider>
    <div className="App">
      <Dashboard /> {/* Render the Dashboard */}
    </div>
    </HabitProvider>
  );
}

export default App;


/* COMPLETE FOLLOWING TASK: Backend Logic
Mini Tasks:
complete PATCH request in habits.js file for 
completed button so it can update the backend )*/ 

