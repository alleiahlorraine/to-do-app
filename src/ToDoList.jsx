import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx'; 
import FullText from './FullText.jsx'; 
import trash from './icons/trash-bin.png';
import edit from './icons/edit.png';
import checkedIcon from './icons/check.png'; 
import uncheckedIcon from './icons/unchecked.png';
import cancel from './icons/cancel.png';
import confirmIcon from './icons/check.png';
import addIcon from './icons/add.png'; 

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
    const [fullTextIndex, setFullTextIndex] = useState(null);
    const [filter, setFilter] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const [pendingDeleteIndex, setPendingDeleteIndex] = useState(null);
    const [showEmptyTaskModal, setShowEmptyTaskModal] = useState(false);
    const [showMarkAllModal, setShowMarkAllModal] = useState(false); 
    const [showMarkTaskModal, setShowMarkTaskModal] = useState(false);
    const [showMarkAllUndoneModal, setShowMarkAllUndoneModal] = useState(false);
    const [pendingMarkIndex, setPendingMarkIndex] = useState(null);

    function handleInputChange(event){
        setNewTask(event.target.value);
    }

    function addTask(){
        if(newTask.trim() !== ""){
            const newTaskItem = { text: newTask, completed: false, dateCreated: new Date().toLocaleString() };
            const updatedTasks = [...tasks, newTaskItem];
            setTasks(updatedTasks);
            setNewTask("");
            saveData(updatedTasks);
        }else{
            setShowEmptyTaskModal(true);
        }
    }

    function deleteTask(index){
        setPendingDeleteIndex(index);
        setShowDeleteModal(true);
    }

    function confirmDelete(){
        if(pendingDeleteIndex !== null) {
            const updatedTasks = tasks.filter((_, i) => i !== pendingDeleteIndex);
            setTasks(updatedTasks);
            saveData(updatedTasks);
        }
        setShowDeleteModal(false);
        setPendingDeleteIndex(null);
    }

    function cancelDelete(){
        setShowDeleteModal(false);
        setPendingDeleteIndex(null);
    }

    function deleteAllTasks(){
        setShowDeleteAllModal(true);
    }

    function confirmDeleteAll(){
        const updatedTasks = tasks.filter(task => {
            if (filter === 'done') return !task.completed;
            if (filter === 'undone') return task.completed;
            return false;
        });
        setTasks(updatedTasks);
        saveData(updatedTasks);
        setShowDeleteAllModal(false);
    }

    function cancelDeleteAll(){
        setShowDeleteAllModal(false);
    }

    function editTask(index){
        if(!tasks[index].completed) {
            setNewTask(tasks[index].text);
            setIsEditing(true);
            setCurrentTaskIndex(index);
        }
    }

    function confirmEdit(){
        if (newTask.trim() === "") {
            setShowEmptyTaskModal(true);
            return;
        }
        const updatedTasks = tasks.map((task, i) => i === currentTaskIndex ? 
                             {...task, text: newTask, dateModified: new Date().toLocaleString()}
                             :task
        );
        setTasks(updatedTasks);
        setNewTask("");
        setIsEditing(false);
        setCurrentTaskIndex(null);
        saveData(updatedTasks);
    }

    function cancelEdit(){
        setNewTask("");
        setIsEditing(false);
        setCurrentTaskIndex(null);
    }

    function taskCompletion(index){
        const updatedTasks = tasks.map((task, i) => i === index ? 
                            {...task, completed: !task.completed, 
                            dateCompleted: !task.completed ? new Date().toLocaleString()
                            :undefined} :task
        );
        setTasks(updatedTasks);
        saveData(updatedTasks);
    }
        

    function confirmMarkTask(){
        if (pendingMarkIndex !== null) {
            const updatedTasks = tasks.map((task, i) => i === pendingMarkIndex ? 
                                 {...task, completed: !task.completed, 
                                 dateCompleted: !task.completed ? new Date().toLocaleString()
                                 :undefined}:task
            );
            setTasks(updatedTasks);
            saveData(updatedTasks);
        }
        setShowMarkTaskModal(false);
        setPendingMarkIndex(null);
    }

    function cancelMarkTask(){
        setShowMarkTaskModal(false);
        setPendingMarkIndex(null);
    }

    function allTasksCompleted(){
        setShowMarkAllModal(true);
    }

    function confirmMarkAll(){
        const allCompleted = tasks.every(task => task.completed);
        const updatedTasks = tasks.map(task => ({...task, completed: !allCompleted,
                             dateCompleted: !allCompleted ? new Date().toLocaleString():task.dateCompleted
        }));
        setTasks(updatedTasks);
        saveData(updatedTasks);
        setShowMarkAllModal(false);
    }

    function cancelMarkAll(){
        setShowMarkAllModal(false);
    }

    function handleMarkAll(){
        const allCompleted = tasks.every(task => task.completed);
        if (allCompleted) {
            setShowMarkAllUndoneModal(true);
        } else {
            allTasksCompleted();
        }
    }

    function confirmMarkAllUndone(){
        const updatedTasks = tasks.map(task => ({
            ...task,
            completed: false,
            dateCompleted: undefined
        }));
        setTasks(updatedTasks);
        saveData(updatedTasks);
        setShowMarkAllUndoneModal(false);
    }

    function cancelMarkAllUndone(){
        setShowMarkAllUndoneModal(false);
    }

    function saveData(tasks){
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    useEffect(() => {
        const localTasks = localStorage.getItem('tasks');
        if(localTasks){
            setTasks(JSON.parse(localTasks));
        }
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredTasks = tasks.filter(task => {
        if(filter === 'done') return task.completed;
        if(filter === 'undone') return !task.completed;
        return true;
    }).filter((task, index) => index !== currentTaskIndex || !isEditing);

    const isNoTasks = filteredTasks.length === 0;

    return (
        <div className="to-do-list-container">
            <div className="to-do-list">
                <h1>To-Do List</h1>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter new task"
                        value={newTask}
                        onChange={handleInputChange}
                    />
                    <div className="button-container">
                        <img
                            className="action-icon"
                            src={isEditing ? confirmIcon : addIcon}
                            alt={isEditing ? 'Confirm Edit' : 'Add'}
                            onClick={isEditing ? (e) => isEditing && newTask !== tasks[currentTaskIndex]?.text ? confirmEdit() : e.preventDefault() : addTask}
                            style={{ cursor: isEditing && newTask === tasks[currentTaskIndex]?.text ? 'not-allowed' : 'pointer' }}
                            disabled={isEditing && newTask === tasks[currentTaskIndex]?.text}
                        />
                        {isEditing && (
                            <img
                                className="cancel-icon"
                                src={cancel}
                                alt="cancel"
                                onClick={cancelEdit}
                            />
                        )}
                    </div>
                </div>
                <div className="filter-actions-container">
                    <div className="filter-container">
                        <select className="custom-select" value={filter} onChange={handleFilterChange} disabled={isEditing}>
                            <option value="all">All Tasks</option>
                            <option value="done">Completed Tasks</option>
                            <option value="undone">Pending Tasks</option>
                        </select>
                    </div>
                    {tasks.length > 0 && (
                        <div className="actions">
                            <button
                                className="toggle-all-button"
                                onClick={handleMarkAll}
                                disabled={isEditing || isNoTasks}
                            >
                                {filteredTasks.every(task => task.completed) ? 'Mark All as Undone' : 'Mark All as Done'}
                            </button>
                            <button className="delete-all-button" onClick={deleteAllTasks} disabled={isEditing || isNoTasks}>
                                Delete All
                            </button>
                        </div>
                    )}
                </div>
                <Modal
                    isOpen={showDeleteModal}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    message="Delete this task?"
                    confirmText="Confirm"
                    cancelText="Cancel"
                />
                <Modal
                    isOpen={showDeleteAllModal}
                    onClose={cancelDeleteAll}
                    onConfirm={confirmDeleteAll}
                    message="Delete all tasks?"
                    confirmText="Confirm"
                    cancelText="Cancel"
                />
                <Modal
                    isOpen={showEmptyTaskModal}
                    onClose={() => setShowEmptyTaskModal(false)}
                    onConfirm={() => setShowEmptyTaskModal(false)}
                    message="Seems like you forgot to put a task..."
                    confirmText="OK"
                />
                <Modal
                    isOpen={showMarkAllModal}
                    onClose={cancelMarkAll}
                    onConfirm={confirmMarkAll}
                    message={`Mark all tasks as done?`}
                    confirmText="Confirm"
                    cancelText="Cancel"
                />
                <Modal
                    isOpen={showMarkAllUndoneModal}
                    onClose={cancelMarkAllUndone}
                    onConfirm={confirmMarkAllUndone}
                    message={`Mark all tasks as undone?`}
                    confirmText="Confirm"
                    cancelText="Cancel"
                />
                <Modal
                    isOpen={showMarkTaskModal}
                    onClose={cancelMarkTask}
                    onConfirm={confirmMarkTask}
                    message={`Mark this task as ${tasks[pendingMarkIndex]?.completed ? 'undone' : 'done'}?`}
                    confirmText="Confirm"
                    cancelText="Cancel"
                />
                <FullText
                    isOpen={fullTextIndex !== null}
                    onClose={() => setFullTextIndex(null)}
                    text={fullTextIndex !== null ? tasks[fullTextIndex].text : ''}
                />
                <div className="task-list-container">
                    {filteredTasks.length === 0 ? (
                        filter === 'done' ? (
                            <p className='no-tasks-message'>You have no completed tasks yet.</p>
                        ) : filter === 'undone' ? (
                            <p className='no-tasks-message'>You're on a roll! Keep it up!</p>
                        ) : (
                            <p className='no-tasks-message'>Yayyy! You have no tasks!</p>
                        )
                    ) : (
                        <ol>
                            {filteredTasks.map((task, index) => (
                                <li key={index}>
                                    <img
                                        className="check-icon"
                                        src={task.completed ? checkedIcon : uncheckedIcon}
                                        alt="check icon"
                                        onClick={() => taskCompletion(tasks.indexOf(task))}
                                    />
                                    <span
                                        className={`text ${task.completed ? 'completed' : ''}`}
                                        onClick={() => setFullTextIndex(fullTextIndex === index ? null : index)}
                                    >
                                        {task.text}
                                    </span>
                                    <div className="task-date">
                                        {task.completed ? `Completed on: ${task.dateCompleted}` : (task.dateModified ? `Modified on: ${task.dateModified}` : `Added on: ${task.dateCreated}`)}
                                    </div>
                                    {!task.completed && (
                                        <img
                                            className="edit-icon"
                                            src={edit}
                                            alt="edit"
                                            onClick={() => editTask(tasks.indexOf(task))}
                                        />
                                    )}
                                    <img
                                        className="delete-icon"
                                        src={trash}
                                        alt="delete"
                                        onClick={() => deleteTask(tasks.indexOf(task))}
                                    />
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ToDoList;