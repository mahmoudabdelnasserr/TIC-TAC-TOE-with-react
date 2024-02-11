import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/log";
import { WINNING_COMBINATIONS } from "./components/winning-combinations";
import GameOver from "./components/GameOver";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
};



function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player == 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer;

}
function deriveWinner(gameBoard, players){
  let winner;

  for (const comb of WINNING_COMBINATIONS) {
    const firstSymbol = gameBoard[comb[0].row][comb[0].column];
    const secondSymbol = gameBoard[comb[1].row][comb[1].column];
    const thirdSymbol = gameBoard[comb[2].row][comb[2].column];
    if (firstSymbol &&
       firstSymbol === secondSymbol &&
        firstSymbol === thirdSymbol) {
        winner = players[firstSymbol];
    }

  }
  return winner;
}

function deriveGameBoard(gameTurns){
  let gameBoard = [...initialGameBoard.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;

  }
  return gameBoard;
}


function App() {
  const [players, setPlayers] = useState(PLAYERS);

  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);

  const gameBoard = deriveGameBoard(gameTurns);

  const winner = deriveWinner(gameBoard, players);
  function restartGame(){
    setGameTurns([]);
  }

  function setNewPlayersNames(symbol, newName){
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      };
    }); 

  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {

    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);


      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;


    });
  }
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName={PLAYERS.X} symbol="X" isActive={activePlayer === 'X'} onChangeName={setNewPlayersNames} />
          <Player initialName="Player 2" symbol="O" isActive={activePlayer === 'O'} onChangeName={setNewPlayersNames} />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} restart={restartGame}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />

      </div>
      <Log turns={gameTurns} />


    </main>
  );



}

export default App
