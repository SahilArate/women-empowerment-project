import React, { useState, useEffect, useRef } from "react";
import "../styles/Health.css";

// Backend API URL - Update this based on your setup
const API_URL = "http://localhost:5000/api";

interface MenstrualEntry {
  date: string;
  flow: string;
  symptoms: string[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ApiErrorResponse {
  error: string;
  details?: string;
}

// Type guard for error objects
const isErrorWithMessage = (error: unknown): error is Error => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

// Helper to get error message
const getErrorMessage = (error: unknown): string => {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return String(error);
};

const Health = () => {
  // Menstrual Cycle Tracker State
  const [menstrualEntries, setMenstrualEntries] = useState<MenstrualEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [flowIntensity, setFlowIntensity] = useState("medium");
  const [symptoms, setSymptoms] = useState<string[]>([]);

  // BMI Calculator State
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");

  // Chatbot State
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Women's Health Assistant. I can help you with health questions, provide wellness tips, and support you with reproductive health, mental well-being, and general health queries. How can I assist you today?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Active section state
  const [activeSection, setActiveSection] = useState("overview");

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Menstrual Cycle Functions
  const handleAddEntry = () => {
    if (selectedDate) {
      const newEntry: MenstrualEntry = {
        date: selectedDate,
        flow: flowIntensity,
        symptoms: symptoms,
      };
      setMenstrualEntries([...menstrualEntries, newEntry]);
      setSelectedDate("");
      setFlowIntensity("medium");
      setSymptoms([]);
      alert("Entry added successfully!");
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  // BMI Calculator
  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBMI.toFixed(1)));

      if (calculatedBMI < 18.5) {
        setBmiCategory("Underweight");
      } else if (calculatedBMI >= 18.5 && calculatedBMI < 25) {
        setBmiCategory("Normal weight");
      } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
        setBmiCategory("Overweight");
      } else {
        setBmiCategory("Obese");
      }
    }
  };

  // Chatbot Function - Updated to call backend API with proper TypeScript types
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
        }),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        console.error("API Error Response:", errorData);
        
        // Handle specific error types
        if (response.status === 400) {
          throw new Error("Invalid request. Please try again.");
        } else if (response.status === 403) {
          throw new Error("API permission denied. Please contact support.");
        } else if (response.status === 429) {
          throw new Error("Too many requests. Please wait a moment and try again.");
        } else if (response.status === 500) {
          throw new Error(errorData.error || "Server error. Please try again later.");
        } else {
          throw new Error(errorData.error || `Error: ${response.status}`);
        }
      }

      const data = await response.json();
      
      // Check if we have valid response data
      if (!data.reply) {
        console.error("Invalid API response structure:", data);
        throw new Error("Received invalid response. Please try again.");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
    } catch (error: unknown) {
      console.error("Chatbot Error:", error);
      
      const errorMsg = getErrorMessage(error);
      let errorMessageText = "I encountered an error: ";
      
      if (errorMsg.includes("Failed to fetch")) {
        errorMessageText = "❌ Network Error\n\nCouldn't connect to the server. Please check:\n" +
                          "• Your internet connection\n" +
                          "• Backend server is running (npm start in backend folder)\n" +
                          "• Backend is running on http://localhost:5000\n" +
                          "• CORS is properly configured";
      } else {
        errorMessageText = "❌ " + errorMsg;
      }
      
      const errorMessage: Message = {
        role: "assistant",
        content: errorMessageText,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="health-container">
      {/* Header */}
      <div className="health-header">
        <h1>🌸 Women's Health Hub 🌸</h1>
        <p>Your Complete Wellness Companion</p>
      </div>

      {/* Navigation */}
      <div className="health-nav">
        <button
          className={activeSection === "overview" ? "active" : ""}
          onClick={() => setActiveSection("overview")}
        >
          🏠 Overview
        </button>
        <button
          className={activeSection === "menstrual" ? "active" : ""}
          onClick={() => setActiveSection("menstrual")}
        >
          📅 Menstrual Tracker
        </button>
        <button
          className={activeSection === "fitness" ? "active" : ""}
          onClick={() => setActiveSection("fitness")}
        >
          💪 Fitness & Nutrition
        </button>
        <button
          className={activeSection === "reproductive" ? "active" : ""}
          onClick={() => setActiveSection("reproductive")}
        >
          🩺 Reproductive Health
        </button>
        <button
          className={activeSection === "mental" ? "active" : ""}
          onClick={() => setActiveSection("mental")}
        >
          🧠 Mental Health
        </button>
        <button
          className={activeSection === "tools" ? "active" : ""}
          onClick={() => setActiveSection("tools")}
        >
          🔧 Health Tools
        </button>
      </div>

      {/* Content */}
      <div className="health-content">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="section-content">
            <h2>Welcome to Your Health Hub</h2>
            <div className="health-cards">
              <div className="health-card">
                <div className="card-icon">📅</div>
                <h3>Menstrual Cycle Tracker</h3>
                <p>
                  Track your periods, symptoms, and patterns. Understand your
                  body better with detailed cycle insights.
                </p>
              </div>
              <div className="health-card">
                <div className="card-icon">💪</div>
                <h3>Fitness & Nutrition</h3>
                <p>
                  Personalized exercise routines and nutritional guidance
                  tailored for women's health needs.
                </p>
              </div>
              <div className="health-card">
                <div className="card-icon">🩺</div>
                <h3>Reproductive Health</h3>
                <p>
                  Comprehensive information about contraception, pregnancy
                  planning, and sexual wellness.
                </p>
              </div>
              <div className="health-card">
                <div className="card-icon">🧠</div>
                <h3>Mental Well-Being</h3>
                <p>
                  Resources for stress management, emotional health, and
                  mindfulness practices.
                </p>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="emergency-contacts">
              <h3>🚨 Emergency Contacts</h3>
              <div className="contact-grid">
                <div className="contact-card">
                  <strong>Emergency</strong>
                  <p>108 / 112</p>
                </div>
                <div className="contact-card">
                  <strong>Women's Helpline</strong>
                  <p>1091 / 181</p>
                </div>
                <div className="contact-card">
                  <strong>Mental Health</strong>
                  <p>1800-599-0019</p>
                </div>
                <div className="contact-card">
                  <strong>Ambulance</strong>
                  <p>102</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menstrual Tracker Section */}
        {activeSection === "menstrual" && (
          <div className="section-content">
            <h2>Menstrual Cycle Tracker</h2>
            <div className="tracker-container">
              <div className="tracker-form">
                <h3>Add New Entry</h3>
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Flow Intensity:</label>
                  <select
                    value={flowIntensity}
                    onChange={(e) => setFlowIntensity(e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Symptoms:</label>
                  <div className="symptoms-grid">
                    {["Cramps", "Fatigue", "Headache", "Mood Swings", "Bloating", "Back Pain"].map(
                      (symptom) => (
                        <button
                          key={symptom}
                          className={`symptom-btn ${
                            symptoms.includes(symptom) ? "active" : ""
                          }`}
                          onClick={() => toggleSymptom(symptom)}
                        >
                          {symptom}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <button className="add-entry-btn" onClick={handleAddEntry}>
                  Add Entry
                </button>
              </div>

              <div className="tracker-history">
                <h3>Cycle History</h3>
                {menstrualEntries.length === 0 ? (
                  <div className="no-entries">
                    No entries yet. Start tracking your cycle!
                  </div>
                ) : (
                  <div className="entries-list">
                    {menstrualEntries
                      .slice()
                      .reverse()
                      .map((entry, index) => (
                        <div key={index} className="entry-card">
                          <div className="entry-date">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
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
        )}

        {/* Fitness Section */}
        {activeSection === "fitness" && (
          <div className="section-content">
            <h2>Fitness & Nutrition Guide</h2>
            <div className="fitness-grid">
              <div className="fitness-card">
                <h3>🏃‍♀️ Exercise Recommendations</h3>
                <ul>
                  <li>Cardio: 150 minutes moderate intensity per week</li>
                  <li>Strength training: 2-3 times per week</li>
                  <li>Yoga or Pilates for flexibility and core strength</li>
                  <li>Walking: 10,000 steps daily goal</li>
                  <li>Rest days: 1-2 days per week for recovery</li>
                </ul>
              </div>
              <div className="fitness-card">
                <h3>🥗 Nutrition Essentials</h3>
                <ul>
                  <li>Iron-rich foods: Spinach, lentils, lean meats</li>
                  <li>Calcium sources: Dairy, fortified foods, leafy greens</li>
                  <li>Omega-3 fatty acids: Fish, walnuts, chia seeds</li>
                  <li>Protein: 0.8g per kg body weight daily</li>
                  <li>Hydration: 8-10 glasses of water daily</li>
                </ul>
              </div>
              <div className="fitness-card">
                <h3>🍎 Healthy Eating Tips</h3>
                <ul>
                  <li>Eat a rainbow of colorful fruits and vegetables</li>
                  <li>Choose whole grains over refined carbs</li>
                  <li>Limit processed foods and added sugars</li>
                  <li>Practice mindful eating and portion control</li>
                  <li>Plan meals ahead to make healthier choices</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Reproductive Health Section */}
        {activeSection === "reproductive" && (
          <div className="section-content">
            <h2>Reproductive Health Information</h2>
            <div className="reproductive-content">
              <div className="info-card">
                <h3>📚 Essential Information</h3>
                <div className="info-topics">
                  <div className="topic">
                    <strong>Menstrual Health</strong>
                    <p>
                      Understanding your cycle, managing symptoms, and
                      recognizing abnormalities. Normal cycles range from 21-35
                      days.
                    </p>
                  </div>
                  <div className="topic">
                    <strong>Contraception Options</strong>
                    <p>
                      Pills, IUDs, barrier methods, implants, and natural
                      family planning. Consult healthcare provider for
                      personalized advice.
                    </p>
                  </div>
                  <div className="topic">
                    <strong>Pregnancy Planning</strong>
                    <p>
                      Preconception care, folic acid supplementation, healthy
                      lifestyle choices, and fertility awareness.
                    </p>
                  </div>
                  <div className="topic">
                    <strong>Sexual Health</strong>
                    <p>
                      STI prevention, regular screenings, safe practices, and
                      open communication with partners.
                    </p>
                  </div>
                  <div className="topic">
                    <strong>PCOS & Endometriosis</strong>
                    <p>
                      Common conditions affecting women. Symptoms, diagnosis,
                      and management strategies available.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mental Health Section */}
        {activeSection === "mental" && (
          <div className="section-content">
            <h2>Mental Health & Well-Being</h2>
            <div className="mental-health-grid">
              <div className="mental-card">
                <h3>🧘‍♀️ Stress Management</h3>
                <ul>
                  <li>Deep breathing exercises (5 min daily)</li>
                  <li>Progressive muscle relaxation</li>
                  <li>Mindfulness meditation</li>
                  <li>Journaling your thoughts</li>
                  <li>Regular physical activity</li>
                </ul>
              </div>
              <div className="mental-card">
                <h3>💭 Emotional Wellness</h3>
                <ul>
                  <li>Recognize and validate your feelings</li>
                  <li>Build strong support networks</li>
                  <li>Set healthy boundaries</li>
                  <li>Practice self-compassion</li>
                  <li>Seek professional help when needed</li>
                </ul>
              </div>
              <div className="mental-card">
                <h3>🌟 Self-Care Practices</h3>
                <ul>
                  <li>Daily gratitude practice</li>
                  <li>Engage in hobbies you love</li>
                  <li>Spend time in nature</li>
                  <li>Connect with loved ones</li>
                  <li>Adequate rest and relaxation</li>
                </ul>
              </div>
            </div>
            <div className="crisis-support">
              <h3>⚠️ Crisis Support</h3>
              <p>
                If you're experiencing a mental health crisis, please reach out:
              </p>
              <div className="crisis-contacts">
                <div>
                  <strong>National Mental Health Helpline:</strong> 1800-599-0019
                </div>
                <div>
                  <strong>Vandrevala Foundation:</strong> 1860-2662-345
                </div>
                <div>
                  <strong>iCall:</strong> 9152987821
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Tools Section */}
        {activeSection === "tools" && (
          <div className="section-content">
            <h2>Health Tools & Calculators</h2>
            <div className="tools-container">
              <div className="tool-card">
                <h3>BMI Calculator</h3>
                <div className="calculator">
                  <div className="calc-input">
                    <label>Height (cm):</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g., 165"
                    />
                  </div>
                  <div className="calc-input">
                    <label>Weight (kg):</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g., 60"
                    />
                  </div>
                  <button className="calc-btn" onClick={calculateBMI}>
                    Calculate BMI
                  </button>
                  {bmi && (
                    <div className="bmi-result">
                      <h4>Your BMI: {bmi}</h4>
                      <p className="bmi-category">Category: {bmiCategory}</p>
                      <div className="bmi-info">
                        <small>
                          • Underweight: &lt; 18.5 <br />
                          • Normal: 18.5 - 24.9 <br />
                          • Overweight: 25 - 29.9 <br />• Obese: ≥ 30
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
                    <strong>💧 Hydration Goal:</strong>
                    <p>Drink 8-10 glasses of water daily</p>
                  </div>
                  <div className="reminder-item">
                    <strong>💊 Medication Reminder:</strong>
                    <p>Set alarms for daily vitamins/medications</p>
                  </div>
                  <div className="reminder-item">
                    <strong>🏥 Annual Check-ups:</strong>
                    <p>Schedule yearly health screenings</p>
                  </div>
                  <div className="reminder-item">
                    <strong>🩺 Breast Self-Exam:</strong>
                    <p>Monthly self-examination recommended</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Chatbot */}
      <div className={`chatbot-container ${isChatOpen ? "open" : ""}`}>
        <div className="chatbot-header" onClick={() => setIsChatOpen(!isChatOpen)}>
          <span>🤖 AI Health Assistant</span>
          <span className="toggle-icon">{isChatOpen ? "▼" : "▲"}</span>
        </div>
        {isChatOpen && (
          <div className="chatbot-content">
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <div className="message-content" style={{ whiteSpace: 'pre-line' }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant">
                  <div className="message-content typing">Typing...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-container">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about women's health..."
                disabled={isLoading}
              />
              <button onClick={sendMessage} disabled={isLoading}>
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