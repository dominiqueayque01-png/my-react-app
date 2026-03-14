import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion'; 
import './App.css'; 
import TaskItem from './components/TaskItem';
import { FiSun, FiMoon } from 'react-icons/fi';

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Personal"); 
  const [filter, setFilter] = useState("All"); 
  const [taskDate, setTaskDate] = useState(getTodayDate()); 

// NEW: State for Dark Mode, checking LocalStorage first!
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("my-smart-theme");
    return savedTheme === "dark" ? true : false;
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("my-smart-tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    } 
    return []; 
  });
  

  useEffect(() => {
    localStorage.setItem("my-smart-tasks", JSON.stringify(tasks));
  }, [tasks]); 

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem("my-smart-theme", "dark");
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem("my-smart-theme", "light");
    }
  }, [isDarkMode]);

  const remainingTasks = tasks.filter(task => !task.completed).length;

  const filteredTasks = tasks.filter(task => {
    if (filter === "All") return true; 
    if (filter === "Active") return !task.completed; 
    if (filter === "Completed") return task.completed; 
    return true;
  });

  const addTask = () => {
    if (input.trim()) {
      const newTask = { 
        id: Date.now(), 
        text: input, 
        completed: false, 
        category: category,
        date: taskDate 
      };
      setTasks([...tasks, newTask]);
      setInput(""); 
      setTaskDate(getTodayDate()); 
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  // NEW: A simplified function just to save the edited text
  const editTaskText = (id, newText) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, text: newText };
        }
        return task;
      })
    );
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  return (
    <div className="app-container">
      <p className="title">My Smart Tracker</p>
      <div className="header-container">
        <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>
        <p className="counter-text">
          You have <strong>{remainingTasks}</strong> task(s) left to do!
        </p>
      </div>

      <div className="input-group">
        <input 
          className="task-input"
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="What needs to be done?"
        />
        <input 
          type="date" 
          className="date-input"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
        />
        <select 
          className="category-select" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Errands">Errands</option>
        </select>
        <button className="add-button" onClick={addTask}>Add</button>
      </div>

      <div className="filter-group">
        <button className={`filter-btn ${filter === "All" ? "active-filter" : ""}`} onClick={() => setFilter("All")}>All</button>
        <button className={`filter-btn ${filter === "Active" ? "active-filter" : ""}`} onClick={() => setFilter("Active")}>Active</button>
        <button className={`filter-btn ${filter === "Completed" ? "active-filter" : ""}`} onClick={() => setFilter("Completed")}>Completed</button>
      </div>

<ul className="task-list">
        {/* AnimatePresence watches the items inside it */}
        <AnimatePresence>
          {filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              toggleComplete={toggleComplete} 
              deleteTask={deleteTask}
              editTaskText={editTaskText}
            />
          ))}
        </AnimatePresence>
      </ul>

      {tasks.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button className="clear-button" onClick={clearCompleted}>
            Clear Completed Tasks
          </button>
        </div>
      )}
    </div>
  );
}