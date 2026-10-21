import { useEffect, useState } from 'react';
import { UserMinus } from 'lucide-react';

import { Button } from '@/components/ui/button';

// Lista as pessoas com acesso ao cavalo e remove as que forem escolhidas
export default function DeleteShares({ horseId, token, onDeleteSuccess = () => {} }) {
  const [shares, setShares] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedShares, setSelectedShares] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${horseId}/shares`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setShares(data.shares || []))
      .catch((err) => console.error('Error loading shares:', err))
      .finally(() => setLoaded(true));
  }, [horseId, token]);

  const toggleSelection = (userId) => {
    setSelectedShares((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleDelete = () => {
    setError(null);
    fetch(`${process.env.REACT_APP_API_SERVER_URL}/horses/${horseId}/delete_shares`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_ids: selectedShares }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error removing shares');
        return res.json();
      })
      .then(() => {
        setShares((prev) => prev.filter((share) => !selectedShares.includes(share.user_id)));
        setSelectedShares([]);
        onDeleteSuccess();
      })
      .catch((err) => {
        console.error('Error removing shares:', err);
        setError('Could not remove access. Please try again.');
      });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-semibold">Remove access</h3>
        <p className="text-[13px] text-muted-foreground">
          Choose who should stop seeing this horse. You keep it in your portfolio.
        </p>
      </div>

      {!loaded ? null : shares.length > 0 ? (
        <>
          <ul className="divide-y overflow-hidden rounded-lg border bg-card">
            {shares.map((share) => (
              <li key={share.user_id}>
                <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5">
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--primary)]"
                    checked={selectedShares.includes(share.user_id)}
                    onChange={() => toggleSelection(share.user_id)}
                  />
                  {share.user_name || `User ${share.user_id}`}
                </label>
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            className="text-destructive"
            onClick={handleDelete}
            disabled={selectedShares.length === 0}
          >
            <UserMinus />
            Remove selected
          </Button>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">This horse is not shared with anyone.</p>
      )}

      {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
