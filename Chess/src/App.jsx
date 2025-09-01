import React, { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import "./App.css";

export default function App() {
  const gameRef = useRef(new Chess());
  const game = gameRef.current;

  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState([]);
  const [history, setHistory] = useState([]);
  const [turn, setTurn] = useState("w");
  const [players, setPlayers] = useState({ white: "White Player", black: "Black Player" });
  const [nameInput, setNameInput] = useState({ white: "", black: "" });
  const [gameStarted, setGameStarted] = useState(false);

  // initialize board / history / turn
  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  const refresh = () => {
    setHistory(game.history({ verbose: true }));
    setTurn(game.turn());
    setSelected(null);
    setMoves([]);
  };

  const onSquareClick = (file, rank) => {
    const square = `${file}${rank}`;

    // If a piece is selected and the clicked square is one of legal moves -> perform move
    if (selected) {
      const legal = moves.find((m) => m.to === square);
      if (legal) {
        try {
          game.move({ from: legal.from, to: legal.to, promotion: "q" });
        } catch (e) {
          // ignore invalid moves (shouldn't happen because we used legal moves)
        }
        refresh();
        return;
      }
    }

    // otherwise, try to select a piece on the clicked square (only pieces that belong to the side to move)
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      const legalMoves = game.moves({ square, verbose: true });
      setSelected(square);
      setMoves(legalMoves);
    } else {
      setSelected(null);
      setMoves([]);
    }
  };

  const undo = () => {
    game.undo();
    refresh();
  };

  const reset = () => {
    game.reset();
    refresh();
  };

  const exportPGN = () => {
    alert(game.pgn() || "No moves yet.");
  };

  // Unicode maps: use distinct glyphs for white and black pieces
  const whiteMap = { p: "♙", r: "♖", n: "♘", b: "♗", q: "♕", k: "♔" };
  const blackMap = { p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚" };

  const renderPiece = (p) => {
    if (!p) return null;
    const char = p.color === "w" ? whiteMap[p.type] : blackMap[p.type];
    return <span className={`piece ${p.color === "w" ? "white" : "black"}`}>{char}</span>;
  };

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  const isLastMoveSquare = (sq) => {
    const h = game.history({ verbose: true });
    if (h.length === 0) return false;
    const last = h[h.length - 1];
    return last.from === sq || last.to === sq;
  };

  if (!gameStarted) {
    return (
      <div className="start-screen">
        <h1>Classic Chess</h1>
        <div className="name-inputs">
          <input
            type="text"
            placeholder="White Player Name"
            value={nameInput.white}
            onChange={(e) => setNameInput({ ...nameInput, white: e.target.value })}
          />
          <input
            type="text"
            placeholder="Black Player Name"
            value={nameInput.black}
            onChange={(e) => setNameInput({ ...nameInput, black: e.target.value })}
          />
        </div>
        <button
          onClick={() => {
            setPlayers({
              white: nameInput.white || "White Player",
              black: nameInput.black || "Black Player",
            });
            setGameStarted(true);
            refresh();
          }}
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Classic Chess — Local 2-Player</h1>
        <div className="controls">
          <button onClick={undo}>Undo</button>
          <button onClick={reset}>Reset</button>
          <button onClick={exportPGN}>Show PGN</button>
        </div>
      </header>

      <main className="main">
        <div className="board-wrapper">
          <div className="board" role="grid" aria-label="Chess board">
            {ranks.map((rank) =>
              files.map((file) => {
                const sq = `${file}${rank}`;
                const rowIndex = 8 - rank;
                const colIndex = files.indexOf(file);
                const isLight = (rowIndex + colIndex) % 2 === 0;
                const pieceObj = game.get(sq);
                const isSelected = selected === sq;
                const isMoveTarget = moves.some((m) => m.to === sq);
                const last = isLastMoveSquare(sq);

                return (
                  <div
                    key={sq}
                    className={`square ${isLight ? "light" : "dark"} ${isSelected ? "selected" : ""} ${
                      isMoveTarget ? "move-target" : ""
                    } ${last ? "last-move" : ""}`}
                    onClick={() => onSquareClick(file, rank)}
                    role="button"
                    aria-label={sq}
                  >
                    {renderPiece(pieceObj)}
                  </div>
                );
              })
            )}
          </div>

          <aside className="sidebar">
            <div className="turn-row">
              <div className={`turn-indicator ${turn === "w" ? "white-turn" : "black-turn"}`} />
              <div className="turn">
                Turn: {turn === "w" ? players.white : players.black}
              </div>
            </div>

            <div className="history">
              <h3>Move History</h3>
              <ol>
                {history.map((m, i) => (
                  <li key={i}>{`${m.color === "w" ? i + 1 + ". " : ""}${m.san}`}</li>
                ))}
              </ol>
            </div>

            <div className="players">
              <p>
                <strong>White:</strong> {players.white}
              </p>
              <p>
                <strong>Black:</strong> {players.black}
              </p>
            </div>
          </aside>
        </div>

        <footer className="footer">
          <p>Two-player local game. Click a piece to see legal moves, click a destination to move.</p>
        </footer>
      </main>
    </div>
  );
}
