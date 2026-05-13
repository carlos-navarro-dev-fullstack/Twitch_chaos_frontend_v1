import { vote } from "../../services/websocket";

export default function VoteButtons({
  options,
  roomId,
  username
}) {
  return (
    <div className="votes">
      {options?.map((option) => (
        <button
          key={option}
          onClick={() =>
            vote(roomId, username, option)
          }
        >
          {option}
        </button>
      ))}
    </div>
  );
}