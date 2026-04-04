import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Home from "./Home";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [tab, setTab] = useState("technical");
  const [search, setSearch] = useState("");
  const [companyType, setCompanyType] = useState("product");
  const [skills, setSkills] = useState([]);
  const [preparationTime, setPreparationTime] = useState(4);
  const [questions, setQuestions] = useState({ technical: [], hr: [] });
  const [resources, setResources] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [weeklyQuestions, setWeeklyQuestions] = useState({});
  const [weeklyChecklist, setWeeklyChecklist] = useState({});
  const [currentWeek, setCurrentWeek] = useState(1);
  const [checklist, setChecklist] = useState([
    { text: "Prepare self introduction", done: true },
    { text: "Revise DBMS, OS, CN, OOP", done: false },
    { text: "Practice 2 coding problems daily", done: false },
    { text: "Complete one aptitude mock test", done: true },
    { text: "Update resume and projects", done: false },
    { text: "Practice HR interview answers", done: false },
  ]);

useEffect(() => {
  if (currentPage !== "home") {
    fetch("http://localhost:5000/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        companyType: companyType,
        skills: skills,
        weeks: preparationTime
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setRoadmap(data.roadmap);
        setQuestions(data.questions);
        setResources(data.resources);
        setWeeklyQuestions(data.weeklyQuestions || {});
        setWeeklyChecklist(data.weeklyChecklist || {});
        setCurrentWeek(1);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }
}, [currentPage, companyType, skills, preparationTime]);

  // Get current week's questions and checklist
  const currentWeekKey = `week${currentWeek}`;
  const currentWeekQuestions = weeklyQuestions[currentWeekKey] || { technical: [], hr: [] };
  const currentWeekChecklistItems = weeklyChecklist[currentWeekKey] || [];

  const progress = useMemo(() => {
    const doneCount = checklist.filter((item) => item.done).length;
    return Math.round((doneCount / checklist.length) * 100);
  }, [checklist]);

  const filteredQuestions = (currentWeekQuestions[tab] || []).filter((q) =>
    q.toLowerCase().includes(search.toLowerCase())
  );

  const toggleChecklist = (index) => {
    const updated = [...checklist];
    updated[index].done = !updated[index].done;
    setChecklist(updated);
  };

  if (currentPage === "home") {
    return (
      <Home
        setCurrentPage={setCurrentPage}
        setCompanyType={setCompanyType}
        setSkills={setSkills}
        setPreparationTime={setPreparationTime}
      />
    );
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-left">
          <span className="badge">Placement Preparation Portal</span>
          <h1>Interview Prep Guide for Campus Placements</h1>
          <p>
            Prepare smarter with aptitude practice, technical interview
            questions, HR guidance, daily checklists, and useful resources.
          </p>
          <div className="hero-buttons">
            <button onClick={() => setCurrentPage("home")}>Start Preparation</button>
          </div>
        </div>

        <div className="hero-right card">
          <h3>Preparation Progress</h3>
          <p>{progress}% completed</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      <section>
        <h2>Preparation Roadmap</h2>
        <div className="grid three">
          {roadmap.map((item, index) => (
            <div className="card" key={index}>
              <h3>{item.title}</h3>
              <ul>
                {item.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Week {currentWeek} - Focus Area</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            {Array.from({ length: preparationTime }, (_, i) => i + 1).map((week) => (
              <button
                key={week}
                onClick={() => setCurrentWeek(week)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: currentWeek === week ? "#007bff" : "#e9ecef",
                  color: currentWeek === week ? "white" : "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: currentWeek === week ? "bold" : "normal"
                }}
              >
                Week {week}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid two">
        <div className="card">
          <h2>Question Bank - Week {currentWeek}</h2>
          <input
            type="text"
            placeholder="Search interview questions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="tabs">
            <button
              className={tab === "technical" ? "active" : ""}
              onClick={() => setTab("technical")}
            >
              Technical ({currentWeekQuestions.technical?.length || 0})
            </button>
            <button
              className={tab === "hr" ? "active" : ""}
              onClick={() => setTab("hr")}
            >
              HR ({currentWeekQuestions.hr?.length || 0})
            </button>
          </div>

          <div className="question-list">
            {filteredQuestions.map((q, index) => (
              <div className="question" key={index}>
                {q}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Daily Checklist - Week {currentWeek}</h2>
          <div className="checklist">
            {currentWeekChecklistItems.map((item, index) => (
              <label className="check-item" key={index}>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => {
                    const updated = [...currentWeekChecklistItems];
                    updated[index].done = !updated[index].done;
                    setWeeklyChecklist({
                      ...weeklyChecklist,
                      [currentWeekKey]: updated
                    });
                  }}
                />
                {item.text}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2>Useful Resources</h2>
        <div className="grid four">
          {resources.map((item, index) => (
            <div className="card" key={index}>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App; 