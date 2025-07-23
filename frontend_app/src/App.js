import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Color/Theme constants from requirements
 */
const COLORS = {
  primary: "#0057B7",
  secondary: "#FFD700",
  accent: "#FF3D00",
  bg: "#fff",
  text: "#282c34"
};

/**
 * Utility function to determine winner of tic-tac-toe
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

/**
 * Square component: a single square on the board
 */
function Square({ value, onClick, isWinning }) {
  return (
    <button
      className={`ttt-square${isWinning ? " highlight" : ""}`}
      onClick={onClick}
      aria-label={`Tic tac toe square${value ? ` with ${value}` : ""}`}
      tabIndex="0"
    >
      {value}
    </button>
  );
}

/**
 * Board component: 3x3 grid of squares
 */
function Board({ squares, onSquareClick, winningLine }) {
  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onClick={() => onSquareClick(idx)}
                isWinning={winningLine && winningLine.includes(idx)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Finds the winning line indices, or null if none.
 */
function findWinningLine(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line;
    }
  }
  return null;
}

// PUBLIC_INTERFACE
/**
 * Main Tic-Tac-Toe App
 * @returns JSX.Element
 */
function App() {
  // Game state: squares, xIsNext, status
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState("");
  const [score, setScore] = useState({ X: 0, O: 0, Draws: 0 });
  const [winningLine, setWinningLine] = useState(null);

  // Responsive theme (always light but allows toggling to dark)
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Effect: Check for winner/status after move
  useEffect(() => {
    const winner = calculateWinner(squares);
    const winLine = findWinningLine(squares);
    if (winner) {
      setStatus(`Winner: ${winner}`);
      setGameOver(true);
      setWinningLine(winLine);
      setScore((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));
    } else if (squares.every(Boolean)) {
      setStatus("Draw!");
      setGameOver(true);
      setWinningLine(null);
      setScore((prev) => ({
        ...prev,
        Draws: prev.Draws + 1,
      }));
    } else {
      setStatus(`Turn: ${xIsNext ? "X" : "O"}`);
      setGameOver(false);
      setWinningLine(null);
    }
    // eslint-disable-next-line
  }, [squares]);

  // PUBLIC_INTERFACE
  /**
   * Handles a square click.
   */
  function handleSquareClick(i) {
    if (gameOver || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  /**
   * Restart the game (reset board, keep scores).
   */
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext((prev) => !prev); // alternate starting player
    setGameOver(false);
    setStatus("Turn: " + (!xIsNext ? "X" : "O"));
    setWinningLine(null);
  }

  // PUBLIC_INTERFACE
  /**
   * Restart score and game (resets all).
   */
  function handleResetScore() {
    setScore({ X: 0, O: 0, Draws: 0 });
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setStatus("Turn: X");
    setWinningLine(null);
  }

  // PUBLIC_INTERFACE
  /**
   * Toggle light/dark theme (optional modernity)
   */
  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <div className="App ttt-app">
      <header className="ttt-header">
        <h1 className="ttt-title">
          <span role="img" aria-label="Tic Tac Toe" style={{color: COLORS.accent}}>●</span>{" "}
          Tic-Tac-Toe
        </h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>
      <main className="ttt-container">
        <section className="ttt-status" aria-live="polite">
          {status}
        </section>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        <div className="ttt-controls">
          <button className="ttt-btn accent" onClick={handleRestart} tabIndex="0">
            Restart Game
          </button>
          <button className="ttt-btn" onClick={handleResetScore} tabIndex="0">
            Reset Score
          </button>
        </div>
        <section className="ttt-scoreboard">
          <h2>Score</h2>
          <div className="ttt-scores">
            <span style={{color: COLORS.primary}}>X: {score.X}</span>
            <span style={{color: COLORS.accent}} className="ttt-score-sep">|</span>
            <span style={{color: COLORS.secondary}}>O: {score.O}</span>
            <span style={{margin: "0 8px", color: "#888"}}>|</span>
            <span style={{color: "#555"}}>Draws: {score.Draws}</span>
          </div>
        </section>
      </main>
      <footer className="ttt-footer">
        <small>
          &copy; {new Date().getFullYear()} Interactive Tic-Tac-Toe. Crafted with{" "}
          <span style={{color: COLORS.accent, verticalAlign: "middle"}}>♥</span>
        </small>
      </footer>
    </div>
  );
}

export default App;
