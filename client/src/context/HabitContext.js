import React, { createContext, useState } from 'react';

// creates a new context object

export const HabitContext = createContext ();

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([]); // Local state to store habits
}