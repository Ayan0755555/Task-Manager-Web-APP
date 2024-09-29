import axios from "axios";
import React, { createContext, useEffect } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverUrl = "http://localhost:8000";

export const TasksProvider = ({ children }) => {
  const userId = useUserContext().user._id;

  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [task, setTask] = React.useState({});
  const [isEditing, setIsEditing] = React.useState(false);
  const [priority, setPriority] = React.useState("all");
  const [activeTask, setActiveTask] = React.useState(null);
  const [modalMode, setModalMode] = React.useState("");
  const [profileModal, setProfileModal] = React.useState(false);

  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask({});
  };

  const openModalForEdit = (task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
    setTask(task); // Also set the task state here
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setModalMode("");
    setActiveTask(null);
    setTask({});
  };

  // get tasks
  const getTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/tasks`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.log("Error getting tasks", error);
      toast.error("Error getting tasks");
    } finally {
      setLoading(false);
    }
  };

  // get task
  const getTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/task/${taskId}`);
      setTask(response.data);
    } catch (error) {
      console.log("Error getting task", error);
      toast.error("Error getting task");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/task/create",
        task
      );
      setTasks((prevTasks) => [...prevTasks, res.data]); // Use functional state update
      toast.success("Task created successfully");
    } catch (error) {
      console.log("Error creating task", error);
      toast.error("Error creating task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (task) => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/task/${task._id}`,
        task
      );
      setTasks((prevTasks) =>
        prevTasks.map((tsk) => (tsk._id === res.data._id ? res.data : tsk))
      ); // Use functional state update
      toast.success("Task updated successfully");
    } catch (error) {
      console.log("Error updating task", error);
      toast.error("Error updating task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/task/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((tsk) => tsk._id !== taskId)); // Use functional state update
      toast.success("Task deleted successfully");
    } catch (error) {
      console.log("Error deleting task", error);
      toast.error("Error deleting task");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (name) => (e) => {
    if (e && e.target) {
      // Ensure e.target is defined
      const value = e.target.value; // Get the input value
      setTask((prevTask) => ({ ...prevTask, [name]: value })); // Use functional update
    }
  };

  // get completed tasks
  const completedTasks = tasks.filter((task) => task.completed);

  // get pending tasks
  const activeTasks = tasks.filter((task) => !task.completed);

  useEffect(() => {
    getTasks();
  }, [userId]);

  console.log("Active tasks", activeTasks);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        priority,
        setPriority,
        handleInput,
        isEditing,
        setIsEditing,
        openModalForAdd,
        openModalForEdit,
        activeTask,
        closeModal,
        modalMode,
        openProfileModal,
        activeTasks,
        completedTasks,
        profileModal,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  return React.useContext(TasksContext);
};
