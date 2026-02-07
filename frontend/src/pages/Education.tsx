import React, { useState, useEffect } from "react";
import "../styles/Education.css";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    previewLink?: string;
    infoLink?: string;
  };
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const Education = () => {
  const [open, setOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [books, setBooks] = useState<Book[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Game States
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Quiz Questions
  const quizQuestions = [
    {
      question: "What percentage of women globally have access to secondary education?",
      options: ["50%", "66%", "75%", "90%"],
      correct: 1,
    },
    {
      question: "Who was the first woman to win a Nobel Prize?",
      options: ["Mother Teresa", "Marie Curie", "Malala Yousafzai", "Jane Goodall"],
      correct: 1,
    },
    {
      question: "What year did women gain the right to vote in the United States?",
      options: ["1890", "1920", "1945", "1960"],
      correct: 1,
    },
    {
      question: "Which country has the highest female literacy rate?",
      options: ["Finland", "Japan", "Norway", "Canada"],
      correct: 0,
    },
    {
      question: "Who wrote 'A Room of One's Own' about women and fiction?",
      options: ["Jane Austen", "Virginia Woolf", "George Eliot", "Charlotte Brontë"],
      correct: 1,
    },
  ];

  // Fetch Books from Google Books API
  const fetchBooks = async (query: string = "women empowerment") => {
    setLoadingBooks(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=12&orderBy=relevance`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoadingBooks(false);
    }
  };

  // Fetch News from NewsAPI
  const fetchNews = async () => {
    setLoadingNews(true);
    try {
      // Using NewsAPI - You'll need to get a free API key from https://newsapi.org/
      const apiKey = "b22c5c6be6414c4f9114947bdb25a75f"; // Replace with your API key
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=women+empowerment+education&sortBy=publishedAt&language=en&apiKey=${apiKey}`
      );
      const data = await response.json();
      setNews(data.articles?.slice(0, 9) || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      // Fallback to mock data if API fails
      setNews([
        {
          title: "Women's Education Breakthrough in 2026",
          description: "New initiatives are making education more accessible for women worldwide.",
          url: "#",
          urlToImage: "https://via.placeholder.com/400x200",
          publishedAt: new Date().toISOString(),
          source: { name: "Education Today" },
        },
      ]);
    } finally {
      setLoadingNews(false);
    }
  };

  // Initialize Memory Game
  const initMemoryGame = () => {
    const icons = ["📚", "✏️", "🎓", "💡", "🌟", "🏆", "📖", "🎯"];
    const cards = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon }));
    setMemoryCards(cards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMemoryMoves(0);
  };

  // Handle Memory Card Click
  const handleCardClick = (index: number) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    ) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(memoryMoves + 1);
      const [first, second] = newFlipped;
      if (memoryCards[first].icon === memoryCards[second].icon) {
        setMatchedCards([...matchedCards, first, second]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  // Handle Quiz Answer
  const handleQuizAnswer = (selectedOption: number) => {
    if (quizQuestions[currentQuestion].correct === selectedOption) {
      setQuizScore(quizScore + 1);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  // Reset Quiz
  const resetQuiz = () => {
    setQuizScore(0);
    setCurrentQuestion(0);
    setShowQuizResult(false);
  };

  useEffect(() => {
    if (activeSection === "books") {
      fetchBooks();
    } else if (activeSection === "news") {
      fetchNews();
    } else if (activeSection === "games") {
      initMemoryGame();
    }
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="section-content">
            <h2>Education & Learning Hub</h2>
            <div className="education-cards">
              <div className="education-card" onClick={() => setActiveSection("books")}>
                <div className="card-icon">📚</div>
                <h3>Book Library</h3>
                <p>
                  Access thousands of books on women's empowerment, leadership, and
                  personal development.
                </p>
              </div>

              <div className="education-card" onClick={() => setActiveSection("news")}>
                <div className="card-icon">📰</div>
                <h3>Latest News</h3>
                <p>
                  Stay updated with the latest news and articles about women in
                  education and leadership.
                </p>
              </div>

              <div className="education-card" onClick={() => setActiveSection("games")}>
                <div className="card-icon">🎮</div>
                <h3>Knowledge Games</h3>
                <p>
                  Test your knowledge and have fun with educational quizzes and brain
                  games.
                </p>
              </div>

              <div className="education-card">
                <div className="card-icon">🎓</div>
                <h3>Online Courses</h3>
                <p>
                  Explore free online courses and certifications to advance your
                  career.
                </p>
              </div>
            </div>

            <div className="stats-section">
              <h3>Education Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">130M</div>
                  <div className="stat-label">Girls Out of School</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">66%</div>
                  <div className="stat-label">Female Literacy Rate</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">2/3</div>
                  <div className="stat-label">Illiterate Adults are Women</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">90%</div>
                  <div className="stat-label">ROI on Girls' Education</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "books":
        return (
          <div className="section-content">
            <h2>Book Library</h2>

            <div className="search-section">
              <input
                type="text"
                placeholder="Search for books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && fetchBooks(searchQuery)}
                className="search-input"
              />
              <button onClick={() => fetchBooks(searchQuery)} className="search-btn">
                Search
              </button>
            </div>

            {loadingBooks ? (
              <div className="loading">Loading books...</div>
            ) : (
              <div className="books-grid">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="book-card"
                    onClick={() => setSelectedBook(book)}
                  >
                    {book.volumeInfo.imageLinks?.thumbnail && (
                      <img
                        src={book.volumeInfo.imageLinks.thumbnail}
                        alt={book.volumeInfo.title}
                        className="book-cover"
                      />
                    )}
                    <div className="book-info">
                      <h4>{book.volumeInfo.title}</h4>
                      {book.volumeInfo.authors && (
                        <p className="book-author">
                          By {book.volumeInfo.authors.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedBook && (
              <div className="book-modal" onClick={() => setSelectedBook(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="close-btn" onClick={() => setSelectedBook(null)}>
                    ×
                  </button>
                  <div className="modal-body">
                    {selectedBook.volumeInfo.imageLinks?.thumbnail && (
                      <img
                        src={selectedBook.volumeInfo.imageLinks.thumbnail}
                        alt={selectedBook.volumeInfo.title}
                        className="modal-book-cover"
                      />
                    )}
                    <div className="modal-info">
                      <h3>{selectedBook.volumeInfo.title}</h3>
                      {selectedBook.volumeInfo.authors && (
                        <p className="modal-author">
                          By {selectedBook.volumeInfo.authors.join(", ")}
                        </p>
                      )}
                      {selectedBook.volumeInfo.description && (
                        <p className="modal-description">
                          {selectedBook.volumeInfo.description}
                        </p>
                      )}
                      <div className="modal-actions">
                        {selectedBook.volumeInfo.previewLink && (
                          <a
                            href={selectedBook.volumeInfo.previewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn"
                          >
                            Preview Book
                          </a>
                        )}
                        {selectedBook.volumeInfo.infoLink && (
                          <a
                            href={selectedBook.volumeInfo.infoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn secondary"
                          >
                            More Info
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "news":
        return (
          <div className="section-content">
            <h2>Latest Education News</h2>
            {loadingNews ? (
              <div className="loading">Loading news...</div>
            ) : (
              <div className="news-grid">
                {news.map((article, index) => (
                  <div key={index} className="news-card">
                    {article.urlToImage && (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="news-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x200";
                        }}
                      />
                    )}
                    <div className="news-content">
                      <div className="news-source">{article.source.name}</div>
                      <h4>{article.title}</h4>
                      <p>{article.description}</p>
                      <div className="news-footer">
                        <span className="news-date">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="read-more"
                        >
                          Read More →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "games":
        return (
          <div className="section-content">
            <h2>Knowledge Games</h2>

            <div className="games-container">
              {/* Quiz Game */}
              <div className="game-card">
                <h3>🎯 Women's Education Quiz</h3>
                {!showQuizResult ? (
                  <div className="quiz-content">
                    <div className="quiz-progress">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </div>
                    <div className="quiz-question">
                      {quizQuestions[currentQuestion].question}
                    </div>
                    <div className="quiz-options">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuizAnswer(index)}
                          className="quiz-option"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="quiz-result">
                    <div className="result-score">
                      Your Score: {quizScore} / {quizQuestions.length}
                    </div>
                    <div className="result-message">
                      {quizScore === quizQuestions.length
                        ? "Perfect! You're a champion! 🏆"
                        : quizScore >= 3
                        ? "Great job! Keep learning! 🌟"
                        : "Keep practicing! You'll get better! 💪"}
                    </div>
                    <button onClick={resetQuiz} className="retry-btn">
                      Try Again
                    </button>
                  </div>
                )}
              </div>

              {/* Memory Game */}
              <div className="game-card">
                <h3>🧠 Memory Match</h3>
                <div className="memory-info">
                  <span>Moves: {memoryMoves}</span>
                  <button onClick={initMemoryGame} className="reset-btn">
                    Reset
                  </button>
                </div>
                <div className="memory-grid">
                  {memoryCards.map((card, index) => (
                    <div
                      key={card.id}
                      className={`memory-card ${
                        flippedCards.includes(index) || matchedCards.includes(index)
                          ? "flipped"
                          : ""
                      } ${matchedCards.includes(index) ? "matched" : ""}`}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className="card-front">?</div>
                      <div className="card-back">{card.icon}</div>
                    </div>
                  ))}
                </div>
                {matchedCards.length === memoryCards.length && memoryCards.length > 0 && (
                  <div className="game-complete">
                    🎉 Completed in {memoryMoves} moves!
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="education-page">
      {/* Sidebar Navigation */}
      <div className={open ? "sidebar open" : "sidebar closed"}>
        <div className="toggle-btn" onClick={() => setOpen(!open)}>
          ☰
        </div>

        <h2 className="sidebar-title">Services</h2>

        <ul>
          <li>
            <a href="/health">Health</a>
          </li>
          <li className="active">
            <a href="/education">Education</a>
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
      <div className="education-main-content">
        <div className="education-container">
          <div className="education-header">
            <h1>Women's Education Center</h1>
            <p>Empowering through knowledge and learning</p>
          </div>

          <div className="education-nav">
            <button
              className={activeSection === "overview" ? "active" : ""}
              onClick={() => setActiveSection("overview")}
            >
              Overview
            </button>
            <button
              className={activeSection === "books" ? "active" : ""}
              onClick={() => setActiveSection("books")}
            >
              Book Library
            </button>
            <button
              className={activeSection === "news" ? "active" : ""}
              onClick={() => setActiveSection("news")}
            >
              Latest News
            </button>
            <button
              className={activeSection === "games" ? "active" : ""}
              onClick={() => setActiveSection("games")}
            >
              Knowledge Games
            </button>
          </div>

          <div className="education-content">{renderSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default Education;