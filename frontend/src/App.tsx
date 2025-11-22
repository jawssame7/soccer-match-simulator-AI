import type React from 'react';
import { useState } from 'react';
import MatchResult from './components/MatchResult';
import TeamInput from './components/TeamInput';
import { simulateMatch } from './services/api';
import type { MatchResult as MatchResultType } from './types/match';
import type { Team } from './types/team';
import './App.css';

const App: React.FC = () => {
  const [homeTeam, setHomeTeam] = useState<Team>({
    name: '',
    manager: '',
    formation: '4-3-3',
    players: [],
  });

  const [awayTeam, setAwayTeam] = useState<Team>({
    name: '',
    manager: '',
    formation: '4-3-3',
    players: [],
  });

  const [matchResult, setMatchResult] = useState<MatchResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    // バリデーション
    if (!homeTeam.name || !awayTeam.name) {
      setError('チーム名を入力してください');
      return;
    }

    if (!homeTeam.manager || !awayTeam.manager) {
      setError('監督名を入力してください');
      return;
    }

    if (homeTeam.players.length < 11 || awayTeam.players.length < 11) {
      setError('各チーム11名の選手を入力してください');
      return;
    }

    // 選手名のチェック
    const allHomePlayersFilled = homeTeam.players.every((p) => p.name.trim() !== '');
    const allAwayPlayersFilled = awayTeam.players.every((p) => p.name.trim() !== '');

    if (!allHomePlayersFilled || !allAwayPlayersFilled) {
      setError('すべての選手名を入力してください');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await simulateMatch(homeTeam, awayTeam);
      setMatchResult(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'シミュレーション中にエラーが発生しました。もう一度お試しください。';
      setError(errorMessage);
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMatchResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>サッカー試合シミュレーター</h1>
        <p>ヨーロッパトップリーグの選手で夢の対戦を実現</p>
      </header>

      {!matchResult ? (
        <main className="app-main">
          <div className="team-inputs">
            <TeamInput
              title="ホームチーム"
              onTeamChange={setHomeTeam}
              sampleDataFile="/sample-team-home.txt"
            />
            <div className="vs-divider">VS</div>
            <TeamInput
              title="アウェイチーム"
              onTeamChange={setAwayTeam}
              sampleDataFile="/sample-team-away.txt"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="simulate-button-container">
            <button
              type="button"
              onClick={handleSimulate}
              disabled={loading}
              className="btn-simulate"
            >
              {loading ? 'シミュレート中...' : '試合をシミュレート'}
            </button>
          </div>

          {loading && (
            <div className="loading-message">
              AIが試合をシミュレート中です。しばらくお待ちください...
            </div>
          )}
        </main>
      ) : (
        <main className="app-main">
          <MatchResult
            result={matchResult}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            onReset={handleReset}
          />
        </main>
      )}

      <footer className="app-footer">
        <p>対象リーグ: プレミアリーグ、ラ・リーガ、セリエA、ブンデスリーガ</p>
      </footer>
    </div>
  );
};

export default App;
