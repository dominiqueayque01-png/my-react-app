import { useState } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
// 1. Import motion from framer-motion
import { motion } from 'framer-motion'; 

export default function TaskItem({ task, toggleComplete, deleteTask, editTaskText }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleSave = () => {
    editTaskText(task.id, editedText);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditedText(task.text); 
    setIsEditing(false);
  };

  return (
    /* 2. Change <li> to <motion.li> and add animation instructions! */
    <motion.li 
      className="task-item"
      layout /* This magic word makes the list smoothly slide up when an item is deleted! */
      initial={{ opacity: 0, y: -20 }} /* Starts invisible and slightly pushed up */
      animate={{ opacity: 1, y: 0 }}   /* Slides into place and fades in */
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }} /* Shrinks and fades out on delete */
    >
      {isEditing ? (
        <div className="edit-mode">
          <input 
            className="task-input"
            value={editedText} 
            onChange={(e) => setEditedText(e.target.value)} 
          />
          <button className="icon-button save-icon" onClick={handleSave} title="Save">
            <FiCheck size={18} />
          </button>
          <button className="icon-button cancel-icon" onClick={cancelEdit} title="Cancel">
            <FiX size={18} />
          </button>
        </div>
      ) : (
        <>
          <div className="task-content">
            <span 
              className={`task-text ${task.completed ? 'completed-text' : ''}`}
              onClick={() => toggleComplete(task.id)}
            >
              {task.text}
            </span>
            
            {task.date && <span className="task-date">📅 {task.date}</span>}

            <span className={`category-badge ${task.category.toLowerCase()}`}>
              {task.category}
            </span>
          </div>

          <div className="action-buttons">
            <button className="icon-button edit-icon" onClick={() => setIsEditing(true)} title="Edit">
              <FiEdit size={16} />
            </button>
            <button className="icon-button delete-icon" onClick={() => deleteTask(task.id)} title="Delete">
              <FiTrash2 size={16} />
            </button>
          </div>
        </>
      )}
    </motion.li>
  );
}