import { useEffect, useState } from "react";

// ── Types ────────────────────────────────────
type Player = {
  id: number;
  pseudo: string;
  uuid: string;
  totalPoints: number;
};

// ── Medal colors for top 3 ───────────────────
const MEDALS = ["🥇", "🥈", "🥉"];

// ── Component ────────────────────────────────
function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("http://localhost:3000/api/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        setError("Could not load leaderboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-[#263023] border border-[#3a4d36] rounded-xl p-4 w-full max-w-md">

      {/* Header */}
      <h3 className="text-xs uppercase tracking-widest text-amber-700
                     border-b border-[#3a4d36] pb-2 mb-3">
        // Global Leaderboard
      </h3>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-[#6b7c67] text-center py-4">
          Loading...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 text-center py-4">{error}</p>
      )}

      {/* Empty state */}
      {!loading && !error && players.length === 0 && (
        <p className="text-sm text-[#6b7c67] text-center py-4">
          No scores yet! Be the first ^!^
        </p>
      )}

      {/* Players */}
      {!loading && !error && players.length > 0 && (
        <ul className="flex flex-col gap-2">
          {players.map((player, index) => (
            <li
              key={player.id}
              className="flex items-center justify-between
                         bg-[#212d1f] rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{MEDALS[index]}</span>
                <span className="text-sm text-amber-200 font-mono">
                  {player.pseudo}
                </span>
              </div>
              <span className="text-sm text-green-400 font-mono tabular-nums">
                {player.totalPoints} pts
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Leaderboard;