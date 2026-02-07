import React, { useState } from "react";
import "../styles/Health.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MenstrualEntry {
  date: string;
  flow: string;
  symptoms: string[];
}

const Health = () => {
  const [open, setOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Menstrual Tracker State
  const [entries, setEntries] = useState<MenstrualEntry[]>([]);
  const [currentDate, setCurrentDate] = useState("");
  const [flow, setFlow] = useState("light");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // BMI Calculator State
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const symptoms = [
    "Cramps",
    "Headache",
    "Fatigue",
    "Mood Swings",
    "Bloating",
    "Back Pain",
  ];

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const addEntry = () => {
    if (!currentDate) {
      alert("Please select a date");
      return;
    }

    const newEntry: MenstrualEntry = {
      date: currentDate,
      flow: flow,
      symptoms: selectedSymptoms,
    };

    setEntries([newEntry, ...entries]);
    setCurrentDate("");
    setFlow("light");
    setSelectedSymptoms([]);
    alert("Entry added successfully!");
  };

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;

    if (w > 0 && h > 0) {
      const bmiValue = w / (h * h);
      setBmi(parseFloat(bmiValue.toFixed(1)));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "Sorry, I couldn't get a response.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, there was an error connecting to the server.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="section-content">
            <h2>Women's Health Overview</h2>
            <div className="health-cards">
              <div className="health-card">
                <div className="card-icon">🩺</div>
                <h3>Regular Checkups</h3>
                <p>
                  Schedule annual health screenings and gynecological exams to
                  maintain optimal health.
                </p>
              </div>

              <div className="health-card">
                <div className="card-icon">💊</div>
                <h3>Preventive Care</h3>
                <p>
                  Stay up to date with vaccinations, screenings, and preventive
                  measures.
                </p>
              </div>

              <div className="health-card">
                <div className="card-icon">🏃‍♀️</div>
                <h3>Active Lifestyle</h3>
                <p>
                  Regular exercise and balanced nutrition are key to long-term
                  health.
                </p>
              </div>

              <div className="health-card">
                <div className="card-icon">🧘‍♀️</div>
                <h3>Mental Wellness</h3>
                <p>
                  Prioritize mental health through mindfulness, therapy, and
                  self-care.
                </p>
              </div>
            </div>

            <div className="emergency-contacts">
              <h3>🚨 Emergency Health Contacts</h3>
              <div className="contact-grid">
                <div className="contact-card">
                  <strong>Ambulance</strong>
                  <p>108 / 102</p>
                </div>
                <div className="contact-card">
                  <strong>Women Helpline</strong>
                  <p>1091</p>
                </div>
                <div className="contact-card">
                  <strong>Mental Health</strong>
                  <p>9152987821</p>
                </div>
                <div className="contact-card">
                  <strong>Pregnancy Helpline</strong>
                  <p>104</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "menstrual":
        return (
          <div className="section-content">
            <h2>Menstrual Health Tracker</h2>
            <div className="tracker-container">
              <div className="tracker-form">
                <h3>Add New Entry</h3>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Flow Intensity</label>
                  <select value={flow} onChange={(e) => setFlow(e.target.value)}>
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Symptoms</label>
                  <div className="symptoms-grid">
                    {symptoms.map((symptom) => (
                      <button
                        key={symptom}
                        type="button"
                        className={`symptom-btn ${
                          selectedSymptoms.includes(symptom) ? "active" : ""
                        }`}
                        onClick={() => toggleSymptom(symptom)}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="add-entry-btn" onClick={addEntry}>
                  Add Entry
                </button>
              </div>

              <div className="tracker-history">
                <h3>Your History</h3>
                {entries.length === 0 ? (
                  <p className="no-entries">No entries yet. Start tracking!</p>
                ) : (
                  <div className="entries-list">
                    {entries.map((entry, index) => (
                      <div key={index} className="entry-card">
                        <div className="entry-date">{entry.date}</div>
                        <div className="entry-flow">
                          Flow: <span>{entry.flow}</span>
                        </div>
                        {entry.symptoms.length > 0 && (
                          <div className="entry-symptoms">
                            Symptoms: {entry.symptoms.join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "fitness":
        return (
          <div className="section-content">
            <h2>Fitness & Nutrition</h2>
            <div className="fitness-grid">
              <div className="fitness-card">
                <h3>Exercise Recommendations</h3>
                <ul>
                  <li>30 minutes of moderate cardio daily</li>
                  <li>Strength training 2-3 times per week</li>
                  <li>Yoga or stretching for flexibility</li>
                  <li>Pelvic floor exercises</li>
                  <li>Walking 10,000 steps daily</li>
                </ul>
              </div>

              <div className="fitness-card">
                <h3>Nutrition Tips</h3>
                <ul>
                  <li>Iron-rich foods for energy</li>
                  <li>Calcium for bone health</li>
                  <li>Omega-3 fatty acids</li>
                  <li>Plenty of fruits and vegetables</li>
                  <li>Stay hydrated - 8 glasses of water daily</li>
                </ul>
              </div>

              <div className="fitness-card">
                <h3>Healthy Habits</h3>
                <ul>
                  <li>7-9 hours of quality sleep</li>
                  <li>Limit processed foods and sugar</li>
                  <li>Manage stress through meditation</li>
                  <li>Avoid smoking and excessive alcohol</li>
                  <li>Regular health screenings</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "reproductive":
        return (
          <div className="section-content">
            <h2>Reproductive Health</h2>
            <div className="reproductive-content">
              <div className="info-card">
                <h3>Important Information</h3>
                <div className="info-topics">
                  <div className="topic">
                    <strong>Contraception</strong>
                    <p>
                      Consult with your healthcare provider to choose the right
                      contraceptive method. Options include pills, IUDs, implants,
                      and barrier methods.
                    </p>
                  </div>

                  <div className="topic">
                    <strong>Pregnancy Planning</strong>
                    <p>
                      Pre-conception health is crucial. Start taking folic acid,
                      maintain a healthy weight, and schedule preconception
                      checkups.
                    </p>
                  </div>

                  <div className="topic">
                    <strong>STI Prevention</strong>
                    <p>
                      Use protection, get regular screenings, and communicate
                      openly with your partner. Early detection is key.
                    </p>
                  </div>

                  <div className="topic">
                    <strong>Menopause</strong>
                    <p>
                      Typically occurs between 45-55 years. Symptoms include hot
                      flashes, mood changes, and irregular periods. Consult your
                      doctor for management options.
                    </p>
                  </div>

                  <div className="topic">
                    <strong>PCOS Awareness</strong>
                    <p>
                      Polycystic Ovary Syndrome affects hormone levels. Symptoms
                      include irregular periods, excess hair growth, and weight
                      gain. Seek medical guidance for proper management.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "mental":
        return (
          <div className="section-content">
            <h2>Mental Health & Well-being</h2>
            <div className="mental-health-grid">
              <div className="mental-card">
                <h3>Self-Care Practices</h3>
                <ul>
                  <li>Practice daily meditation or mindfulness</li>
                  <li>Maintain a gratitude journal</li>
                  <li>Set healthy boundaries</li>
                  <li>Take breaks and rest when needed</li>
                  <li>Engage in hobbies you enjoy</li>
                </ul>
              </div>

              <div className="mental-card">
                <h3>Stress Management</h3>
                <ul>
                  <li>Deep breathing exercises</li>
                  <li>Progressive muscle relaxation</li>
                  <li>Regular physical activity</li>
                  <li>Connect with supportive friends</li>
                  <li>Limit social media consumption</li>
                </ul>
              </div>

              <div className="mental-card">
                <h3>When to Seek Help</h3>
                <ul>
                  <li>Persistent sadness or anxiety</li>
                  <li>Changes in sleep or appetite</li>
                  <li>Difficulty concentrating</li>
                  <li>Withdrawal from activities</li>
                  <li>Thoughts of self-harm</li>
                </ul>
              </div>
            </div>

            <div className="crisis-support">
              <h3>⚠️ Crisis Support</h3>
              <p>
                If you're experiencing a mental health crisis, please reach out
                immediately:
              </p>
              <div className="crisis-contacts">
                <div>
                  <strong>National Mental Health Helpline:</strong> 1800-599-0019
                </div>
                <div>
                  <strong>Vandrevala Foundation:</strong> 9999 666 555
                </div>
                <div>
                  <strong>iCall (TISS):</strong> 9152987821
                </div>
                <div>
                  <strong>Emergency:</strong> 112
                </div>
              </div>
            </div>
          </div>
        );

      case "tools":
        return (
          <div className="section-content">
            <h2>Health Tools</h2>
            <div className="tools-container">
              <div className="tool-card">
                <h3>BMI Calculator</h3>
                <div className="calculator">
                  <div className="calc-input">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Enter weight"
                    />
                  </div>

                  <div className="calc-input">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Enter height"
                    />
                  </div>

                  <button className="calc-btn" onClick={calculateBMI}>
                    Calculate BMI
                  </button>

                  {bmi !== null && (
                    <div className="bmi-result">
                      <h4>Your BMI: {bmi}</h4>
                      <div className="bmi-category">{getBMICategory(bmi)}</div>
                      <div className="bmi-info">
                        <small>
                          <strong>BMI Categories:</strong>
                          <br />
                          Underweight: &lt; 18.5
                          <br />
                          Normal: 18.5 - 24.9
                          <br />
                          Overweight: 25 - 29.9
                          <br />
                          Obese: ≥ 30
                        </small>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="tool-card">
                <h3>Health Reminders</h3>
                <div className="reminders">
                  <div className="reminder-item">
                    <strong>Annual Checkup</strong>
                    <p>Schedule your yearly physical exam and screening tests</p>
                  </div>

                  <div className="reminder-item">
                    <strong>Gynecological Exam</strong>
                    <p>Book your annual pelvic exam and pap smear</p>
                  </div>

                  <div className="reminder-item">
                    <strong>Mammogram</strong>
                    <p>If 40+, schedule your annual breast cancer screening</p>
                  </div>

                  <div className="reminder-item">
                    <strong>Bone Density Test</strong>
                    <p>If 65+, or at risk, get osteoporosis screening</p>
                  </div>

                  <div className="reminder-item">
                    <strong>Vitamin D Check</strong>
                    <p>Get your vitamin D levels tested annually</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="health-page">
      {/* Sidebar Navigation */}
      <div className={open ? "sidebar open" : "sidebar closed"}>
        <div className="toggle-btn" onClick={() => setOpen(!open)}>
          ☰
        </div>

        <h2 className="sidebar-title">Services</h2>

        <ul>
          <li className="active">
            <a href="/health">Health</a>
          </li>
          <li>
            <a href="/dashboard">Education</a>
          </li>
          <li>
            <a href="/dashboard">Safety</a>
          </li>
          <li>
            <a href="/dashboard">Mental Well Being</a>
          </li>
          <li>
            <a href="/dashboard">Financial Independence</a>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="health-main-content">
        <div className="health-container">
          <div className="health-header">
            <h1>Women's Health Center</h1>
            <p>Your comprehensive guide to health and wellness</p>
          </div>

          <div className="health-nav">
            <button
              className={activeSection === "overview" ? "active" : ""}
              onClick={() => setActiveSection("overview")}
            >
              Overview
            </button>
            <button
              className={activeSection === "menstrual" ? "active" : ""}
              onClick={() => setActiveSection("menstrual")}
            >
              Menstrual Tracker
            </button>
            <button
              className={activeSection === "fitness" ? "active" : ""}
              onClick={() => setActiveSection("fitness")}
            >
              Fitness & Nutrition
            </button>
            <button
              className={activeSection === "reproductive" ? "active" : ""}
              onClick={() => setActiveSection("reproductive")}
            >
              Reproductive Health
            </button>
            <button
              className={activeSection === "mental" ? "active" : ""}
              onClick={() => setActiveSection("mental")}
            >
              Mental Health
            </button>
            <button
              className={activeSection === "tools" ? "active" : ""}
              onClick={() => setActiveSection("tools")}
            >
              Health Tools
            </button>
          </div>

          <div className="health-content">{renderSection()}</div>
        </div>
      </div>

      {/* AI Chatbot */}
      <div className={`chatbot-container ${chatOpen ? "open" : ""}`}>
        <div className="chatbot-header" onClick={() => setChatOpen(!chatOpen)}>
          <span>💬 Health Assistant</span>
          <span className="toggle-icon">{chatOpen ? "−" : "+"}</span>
        </div>

        {chatOpen && (
          <div className="chatbot-content">
            <div className="messages-container">
              {messages.length === 0 && (
                <div className="message assistant">
                  <div className="message-content">
                    Hello! I'm your health assistant. How can I help you today?
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}

              {loading && (
                <div className="message assistant">
                  <div className="message-content typing">Typing...</div>
                </div>
              )}
            </div>

            <div className="chat-input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about health..."
                disabled={loading}
              />
              <button onClick={sendMessage} disabled={loading}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Health;