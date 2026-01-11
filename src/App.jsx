import { useEffect, useState } from "react";
import { motivations } from "./motivations";
import "./App.css";
import sportIcon from "./images/dumbell.jpg";
import opinionIcon from "./images/opinion.png";
import checkIcon from "./images/checkIcon.png";

export default function App() {
  const [days, setDays] = useState([]);
  const [motivation, setMotivation] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("fitnessData"));

    if (stored) {
      setDays(stored);
    } else {
      const initial = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        type: "",
        duration: "",
        energy: "",
        done: false,
      }));
      setDays(initial);
    }
  }, []);

  // Persist
  useEffect(() => {
    if (days.length) {
      localStorage.setItem("fitnessData", JSON.stringify(days));
    }
  }, [days]);

  // Daily motivation
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem("dailyMotivation"));

    if (saved?.date === today) {
      setMotivation(saved.text);
    } else {
      const text = motivations[Math.floor(Math.random() * motivations.length)];
      localStorage.setItem(
        "dailyMotivation",
        JSON.stringify({ date: today, text })
      );
      setMotivation(text);
    }
  }, []);

  const updateDay = (index, field, value) => {
    const updated = [...days];
    updated[index][field] = value;
    setDays(updated);
  };

  const toggleDone = (index) => {
    const updated = [...days];
    updated[index].done = !updated[index].done;
    setDays(updated);
  };

  const completedCount = days.filter((d) => d.done).length;

  return (
    <div className="container">
      <h1 className="title">30 Günlük Spor Takibi</h1>

      <div className="motivation">
        <img
          src={opinionIcon}
          alt=""
          width={35}
          height={35}
          className="logo2"
        />
        <span>{motivation}</span>
      </div>

      <p
        style={{
          marginBottom: "15px",
          padding: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img src={checkIcon} alt="" width={35} height={35} />
        <span>Yapılan gün: {completedCount} / 30</span>
      </p>

      <div className="grid">
        {days.map((d, i) => (
          <div key={d.day} className="card">
            <div className="header">
              <strong>Gün {d.day}</strong>
              <input
                type="checkbox"
                checked={d.done}
                onChange={() => toggleDone(i)}
              />
            </div>

            <input
              placeholder="Spor türü"
              value={d.type}
              onChange={(e) => updateDay(i, "type", e.target.value)}
            />

            <input
              type="number"
              placeholder="Süre (dk)"
              value={d.duration}
              onChange={(e) => updateDay(i, "duration", e.target.value)}
            />

            <input
              type="number"
              min="1"
              max="5"
              placeholder="Enerji (1–5)"
              value={d.energy}
              onChange={(e) => updateDay(i, "energy", e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
