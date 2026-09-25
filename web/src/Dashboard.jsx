import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [seconds, setSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  const loadSubjects = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/subjects?user_id=${userId}`
      );
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error(error);
      setMessage("Subjects load nahi ho rahe");
    }
  };

  const loadTasks = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tasks?user_id=${userId}`
      );
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
      setMessage("Tasks load nahi ho rahe");
    }
  };

  useEffect(() => {
    loadSubjects();
    loadTasks();
  }, []);

  useEffect(() => {
    if (!timerRunning) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning]);

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setSeconds(25 * 60);
  };

  const handleAddSubject = async () => {
    if (!subject.trim()) {
      setMessage("Please enter a subject name");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/subjects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: subject,
            user_id: Number(userId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Failed to add subject");
        return;
      }

      setMessage(data.message);
      setSubject("");
      loadSubjects();
    } catch (error) {
      console.error(error);
      setMessage("Backend se connection nahi ho raha");
    }
  };

  const handleEditSubject = (item) => {
    setSubject(item.name);
    setEditingId(item.id);
    setMessage("");
  };

  const handleUpdateSubject = async () => {
    if (!subject.trim()) {
      setMessage("Please enter a subject name");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/subjects/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: subject,
            user_id: Number(userId),
          }),
        }
      );

      const data = await response.json();

      setMessage(data.message);
      setSubject("");
      setEditingId(null);
      loadSubjects();
    } catch (error) {
      console.error(error);
      setMessage("Subject update nahi ho raha");
    }
  };

  const handleCancelEdit = () => {
    setSubject("");
    setEditingId(null);
    setMessage("");
  };

  const handleDeleteSubject = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/subjects/${id}?user_id=${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      setMessage(data.message);
      loadSubjects();
    } catch (error) {
      console.error(error);
      setMessage("Subject delete nahi ho raha");
    }
  };

  const handleAddTask = async () => {
    if (!task.trim()) {
      setMessage("Please enter a task");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: task,
            user_id: Number(userId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Failed to add task");
        return;
      }

      setMessage(data.message);
      setTask("");
      loadTasks();
    } catch (error) {
      console.error(error);
      setMessage("Task add nahi ho raha");
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tasks/${id}/complete?user_id=${userId}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      setMessage(data.message);
      loadTasks();
    } catch (error) {
      console.error(error);
      setMessage("Task update nahi ho raha");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tasks/${id}?user_id=${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      setMessage(data.message);
      loadTasks();
    } catch (error) {
      console.error(error);
      setMessage("Task delete nahi ho raha");
    }
  };

  const completedTasks = tasks.filter(
    (item) => item.completed
  ).length;

  const progress =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">S</div>
          <span>StudyMate</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span>⌂</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span>▣</span>
            Subjects
          </div>

          <div className="nav-item">
            <span>✓</span>
            Tasks
          </div>

          <div className="nav-item">
            <span>◷</span>
            Study Timer
          </div>
        </nav>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("userEmail");

            navigate("/login");
          }}
        >
          ⇥ Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main">

        {/* TOP */}
        <header className="dashboard-header">
          <div>
            <p className="small-label">STUDENT DASHBOARD</p>
            <h1>Welcome back, {userName || "Student"}!</h1>
            <p className="header-subtitle">
              Stay focused. Keep learning. Keep growing.
            </p>
          </div>

          <div className="profile-circle">
            {(userName || "S").charAt(0).toUpperCase()}
          </div>
        </header>

        {/* STATS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon purple">📚</div>
            <div>
              <p>Subjects</p>
              <h2>{subjects.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">✓</div>
            <div>
              <p>Total Tasks</p>
              <h2>{tasks.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">↗</div>
            <div>
              <p>Progress</p>
              <h2>{progress}%</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">⏱</div>
            <div>
              <p>Focus Time</p>
              <h2>25 min</h2>
            </div>
          </div>

        </section>

        {/* CONTENT GRID */}
        <section className="content-grid">

          {/* SUBJECTS */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>My Subjects</h2>
                <p>Manage your study subjects</p>
              </div>

              <span className="count-badge">
                {subjects.length}
              </span>
            </div>

            <div className="add-row">
              <input
                type="text"
                placeholder="Enter subject name..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              {editingId ? (
                <>
                  <button
                    className="primary-btn"
                    onClick={handleUpdateSubject}
                  >
                    Update
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="primary-btn"
                  onClick={handleAddSubject}
                >
                  + Add
                </button>
              )}
            </div>

            <div className="list-container">
              {subjects.length === 0 ? (
                <div className="empty-state">
                  <div>📚</div>
                  <p>No subjects added yet.</p>
                </div>
              ) : (
                subjects.map((item) => (
                  <div className="list-item" key={item.id}>
                    <div className="item-left">
                      <div className="item-icon subject-icon">
                        {item.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <strong>{item.name}</strong>
                        <small>Study subject</small>
                      </div>
                    </div>

                    <div className="item-actions">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEditSubject(item)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteSubject(item.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TASKS */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>Today's Tasks</h2>
                <p>Stay on top of your work</p>
              </div>

              <span className="count-badge">
                {tasks.length}
              </span>
            </div>

            <div className="add-row">
              <input
                type="text"
                placeholder="What do you need to do?"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />

              <button
                className="primary-btn"
                onClick={handleAddTask}
              >
                + Add
              </button>
            </div>

            <div className="list-container">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <div>✓</div>
                  <p>No tasks added yet.</p>
                </div>
              ) : (
                tasks.map((item) => (
                  <div className="list-item" key={item.id}>
                    <div className="item-left">
                      <button
                        className={`check-btn ${
                          item.completed ? "checked" : ""
                        }`}
                        onClick={() =>
                          handleCompleteTask(item.id)
                        }
                      >
                        {item.completed ? "✓" : ""}
                      </button>

                      <div>
                        <strong
                          className={
                            item.completed
                              ? "completed-task"
                              : ""
                          }
                        >
                          {item.title}
                        </strong>

                        <small>
                          {item.completed
                            ? "Completed"
                            : "Pending"}
                        </small>
                      </div>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteTask(item.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

        {/* BOTTOM GRID */}
        <section className="bottom-grid">

          {/* PROGRESS */}
          <div className="dashboard-panel progress-panel">
            <div className="panel-header">
              <div>
                <h2>Study Progress</h2>
                <p>Your task completion progress</p>
              </div>
            </div>

            <div className="progress-content">
              <div className="progress-circle">
                <span>{progress}%</span>
              </div>

              <div className="progress-info">
                <h3>
                  {completedTasks} of {tasks.length} tasks completed
                </h3>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <p>
                  Keep going and complete your remaining tasks.
                </p>
              </div>
            </div>
          </div>

          {/* TIMER */}
          <div className="dashboard-panel timer-panel">
            <div className="panel-header">
              <div>
                <h2>Focus Timer</h2>
                <p>Pomodoro study session</p>
              </div>

              <span className="timer-icon">◷</span>
            </div>

            <div className="timer-display">
              {formatTime()}
            </div>

            <div className="timer-buttons">
              <button
                className="timer-start"
                onClick={() =>
                  setTimerRunning(!timerRunning)
                }
              >
                {timerRunning ? "Pause" : "Start Focus"}
              </button>

              <button
                className="timer-reset"
                onClick={handleResetTimer}
              >
                Reset
              </button>
            </div>
          </div>

        </section>

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard;