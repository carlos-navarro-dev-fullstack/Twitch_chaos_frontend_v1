export default function GameStats({ game }) {
  return (
    <div className="stats">
      <p>ROUND: {game.round}</p>

      <p>REPUTATION: {game.reputation}</p>

      <p>FUNA: {game.funa}</p>

      <p>PLAYERS: {game.players}</p>

      <p>STATE: {game.state}</p>
    </div>
  );
}