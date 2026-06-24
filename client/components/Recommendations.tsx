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
    <div className="app-shell">
      <section className="search-panel" aria-labelledby="search-heading">
        <p className="eyebrow">Cue</p>
        <h2 id="search-heading">Find the right track for the moment</h2>
        <form className="search-form" onSubmit={handleSubmit}>
          <label htmlFor="music-query">What do you want to hear?</label>
          <div className="search-row">
            <input
              id="music-query"
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="rainy night drive, 90s R&B, nervous energy..."
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Find Songs'}
            </button>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      {recommendation && (
        <section className="result" aria-live="polite">
          <h2>Recommendations</h2>
          <div className="recommendation-output">
            <ReactMarkdown>{recommendation}</ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
};

export default Recommendations;
