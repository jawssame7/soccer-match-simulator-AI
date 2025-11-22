import type React from 'react';
import type { MatchResult as MatchResultType } from '../types/match';
import type { Team } from '../types/team';
import Statistics from './Statistics';

interface MatchResultProps {
  result: MatchResultType;
  homeTeam: Team;
  awayTeam: Team;
  onReset: () => void;
}

const MatchResult: React.FC<MatchResultProps> = ({ result, homeTeam, awayTeam, onReset }) => {
  return (
    <div className="match-result">
      <div className="scoreboard">
        <div className="team-score">
          <h2>{homeTeam.name}</h2>
          <div className="score">{result.score.home}</div>
        </div>
        <div className="score-separator">-</div>
        <div className="team-score">
          <h2>{awayTeam.name}</h2>
          <div className="score">{result.score.away}</div>
        </div>
      </div>

      <div className="half-time-score">
        ハーフタイム: {result.score.halfTime.home} - {result.score.halfTime.away}
      </div>

      {/* 試合環境情報 */}
      <div className="weather-info">
        <h3>試合環境</h3>
        <div className="weather-details">
          <span>天候: {result.weather.condition}</span>
          <span>気温: {result.weather.temperature}°C</span>
          <span>ピッチ: {result.weather.pitchCondition}</span>
        </div>
      </div>

      {/* チームメンバー */}
      <div className="lineups-section">
        <h3>スターティングメンバー</h3>
        <div className="lineups-container">
          <div className="team-lineup">
            <h4>{homeTeam.name}</h4>
            <div className="manager-info">
              <span className="manager-label">監督:</span> {homeTeam.manager}
            </div>
            <div className="formation-info">
              <span className="formation-label">フォーメーション:</span> {homeTeam.formation}
            </div>
            <div className="players-list">
              {homeTeam.players.map((player, index) => (
                <div key={`home-player-${index}-${player.name}`} className="player-item">
                  <span className="player-position">{player.position}</span>
                  <span className="player-name">{player.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="team-lineup">
            <h4>{awayTeam.name}</h4>
            <div className="manager-info">
              <span className="manager-label">監督:</span> {awayTeam.manager}
            </div>
            <div className="formation-info">
              <span className="formation-label">フォーメーション:</span> {awayTeam.formation}
            </div>
            <div className="players-list">
              {awayTeam.players.map((player, index) => (
                <div key={`away-player-${index}-${player.name}`} className="player-item">
                  <span className="player-position">{player.position}</span>
                  <span className="player-name">{player.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 試合の流れ */}
      <div className="match-flow">
        <h3>試合の流れ</h3>
        <div className="flow-section">
          <h4>前半</h4>
          <p>{result.matchFlow.firstHalf}</p>
        </div>
        <div className="flow-section">
          <h4>後半</h4>
          <p>{result.matchFlow.secondHalf}</p>
        </div>
      </div>

      {/* 得点シーン */}
      <div className="goals-section">
        <h3>得点シーン</h3>
        {result.goals.length > 0 ? (
          <div className="goals-timeline">
            {result.goals.map((goal) => (
              <div key={`goal-${goal.minute}-${goal.scorer}`} className="goal-item">
                <div className="goal-time">{goal.minute}'</div>
                <div className="goal-details">
                  <div className="goal-scorer">
                    {goal.scorer} ({goal.team})
                  </div>
                  {goal.assist && <div className="goal-assist">アシスト: {goal.assist}</div>}
                  <div className="goal-description">{goal.description}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>得点なし</p>
        )}
      </div>

      {/* ハイライト */}
      <div className="highlights-section">
        <h3>ハイライト</h3>
        {result.highlights.length > 0 ? (
          <div className="highlights-list">
            {result.highlights.map((highlight) => (
              <div
                key={`highlight-${highlight.minute}-${highlight.description.substring(0, 20)}`}
                className="highlight-item"
              >
                <div className="highlight-time">{highlight.minute}'</div>
                <div className="highlight-description">{highlight.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>ハイライトなし</p>
        )}
      </div>

      {/* 統計データ */}
      <Statistics
        statistics={result.statistics}
        homeTeamName={homeTeam.name}
        awayTeamName={awayTeam.name}
      />

      <button type="button" onClick={onReset} className="btn-reset">
        新しい試合をシミュレート
      </button>
    </div>
  );
};

export default MatchResult;
