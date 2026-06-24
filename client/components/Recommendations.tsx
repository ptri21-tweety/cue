import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { SyntheticEvent } from 'react';

interface ParsedResponse {
  recommendation: string;
}

const Recommendations = () => {
  const [userQuery, setUserQuery] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendation('');

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery }),
      });

      if (response.status !== 200) {
        const parsedError: { err: string } = await response.json();
        setError(parsedError.err);
      } else {
        const parsedResponse: ParsedResponse = await response.json();
        setRecommendation(parsedResponse.recommendation);
      }
    } catch (_err) {
      setError('Error fetching recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <label>
          vibe:
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="what are you feelin?"
            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          />
        </label>
        <button type="submit" style={{ marginTop: '16px' }} disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendation'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {recommendation && (
        <div style={{ marginTop: '24px' }}>
          <h2>Recommendations:</h2>
          <ReactMarkdown>{recommendation}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
