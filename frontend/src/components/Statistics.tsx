import type React from 'react';
import type { Statistics as StatisticsType } from '../types/match';

interface StatisticsProps {
  statistics: StatisticsType;
  homeTeamName: string;
  awayTeamName: string;
}

interface StatItemProps {
  label: string;
  homeValue: number;
  awayValue: number;
  isPercentage?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  homeValue,
  awayValue,
  isPercentage = false,
}) => {
  const total = homeValue + awayValue;
  const homePercentage = total > 0 ? (homeValue / total) * 100 : 50;
  const awayPercentage = total > 0 ? (awayValue / total) * 100 : 50;

  return (
    <div className="stat-item">
      <div className="stat-values">
        <span className="stat-home">
          {homeValue}
          {isPercentage ? '%' : ''}
        </span>
        <span className="stat-label">{label}</span>
        <span className="stat-away">
          {awayValue}
          {isPercentage ? '%' : ''}
        </span>
      </div>
      <div className="stat-bar">
        <div className="stat-bar-home" style={{ width: `${homePercentage}%` }} />
        <div className="stat-bar-away" style={{ width: `${awayPercentage}%` }} />
      </div>
    </div>
  );
};

const Statistics: React.FC<StatisticsProps> = ({ statistics, homeTeamName, awayTeamName }) => {
  return (
    <div className="statistics-section">
      <h3>統計データ</h3>
      <div className="statistics-container">
        <div className="team-labels">
          <span className="home-label">{homeTeamName}</span>
          <span className="away-label">{awayTeamName}</span>
        </div>

        <StatItem
          label="ポゼッション"
          homeValue={statistics.possession.home}
          awayValue={statistics.possession.away}
          isPercentage={true}
        />

        <StatItem
          label="シュート数"
          homeValue={statistics.shots.home}
          awayValue={statistics.shots.away}
        />

        <StatItem
          label="枠内シュート"
          homeValue={statistics.shotsOnTarget.home}
          awayValue={statistics.shotsOnTarget.away}
        />

        <StatItem
          label="コーナーキック"
          homeValue={statistics.corners.home}
          awayValue={statistics.corners.away}
        />

        <StatItem
          label="ファウル"
          homeValue={statistics.fouls.home}
          awayValue={statistics.fouls.away}
        />

        <StatItem
          label="イエローカード"
          homeValue={statistics.yellowCards.home}
          awayValue={statistics.yellowCards.away}
        />

        {(statistics.redCards.home > 0 || statistics.redCards.away > 0) && (
          <StatItem
            label="レッドカード"
            homeValue={statistics.redCards.home}
            awayValue={statistics.redCards.away}
          />
        )}
      </div>
    </div>
  );
};

export default Statistics;
