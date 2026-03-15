import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion'; 
import './App.css'; 
import TaskItem from './components/TaskItem';
import Header from './components/Header'; 
import Footer from './components/Footer'; 

export default function App() {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Personal"); 
  const [filter, setFilter] = useState("All"); 

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
        category: category
        // Notice we completely removed the date from here!
      };
      setTasks([...tasks, newTask]);
      setInput(""); 
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

  const testNotification = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
      return;
    }
    if (Notification.permission === "granted") {
      new Notification("SmartTask: Time to work!", {
        body: "This is what your task reminders will look like.",
        icon: "https://cdn-icons-png.flaticon.com/512/762/762686.png" 
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Awesome!", {
            body: "You will now get task reminders."
          });
        }
      });
    }
  };

  return (
    <div className="page-wrapper">
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        testNotification={testNotification} 
      />

      <main className="main-content">
        <div className="app-container">
          
          <div className="header-container">
            <h1 className="title">My Dashboard</h1>
          </div>
          
          <p className="counter-text">
            You have <strong>{remainingTasks}</strong> task(s) left to do!
          </p>

          <div className="input-group">
            <input 
              className="task-input"
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="What needs to be done?"
            />
            {/* The date input has been completely removed from here! */}
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

          {filteredTasks.length === 0 && (
            <div className="empty-state">
              <p>📝 No tasks found. Time to relax or add a new one!</p>
            </div>
          )}

          {tasks.length > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {filter === "Completed" && filteredTasks.length > 0 && (
                <button className="clear-button" onClick={clearCompleted}>
                  Clear Completed
                </button>
              )}
              {tasks.length > 0 && (
              <button className="clear-button" onClick={testNotification}>
                Test Notification 🔔
              </button>
            )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}