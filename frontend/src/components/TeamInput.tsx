import type React from 'react';
import { useEffect, useState } from 'react';
import type { Team } from '../types/team';
import { generatePlayerTemplate, parsePlayerInput } from '../utils/formationPositions';

interface TeamInputProps {
  title: string;
  onTeamChange: (team: Team) => void;
  sampleDataFile?: string;
}

const TeamInput: React.FC<TeamInputProps> = ({ title, onTeamChange, sampleDataFile }) => {
  const [teamName, setTeamName] = useState('');
  const [manager, setManager] = useState('');
  const [formation, setFormation] = useState('4-3-3');
  const [playerText, setPlayerText] = useState(generatePlayerTemplate('4-3-3'));

  const updateTeam = () => {
    const players = parsePlayerInput(playerText, formation);
    onTeamChange({
      name: teamName,
      manager,
      formation,
      players,
    });
  };

  useEffect(() => {
    updateTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamName, manager, formation, playerText]);

  const handleTeamNameChange = (value: string) => {
    setTeamName(value);
  };

  const handleManagerChange = (value: string) => {
    setManager(value);
  };

  const handleFormationChange = (value: string) => {
    setFormation(value);
    setPlayerText(generatePlayerTemplate(value));
  };

  const handlePlayerTextChange = (value: string) => {
    setPlayerText(value);
  };

  const loadSampleData = async () => {
    if (!sampleDataFile) return;

    try {
      const response = await fetch(sampleDataFile);
      const text = await response.text();

      const lines = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line);

      let loadedTeamName = '';
      let loadedManager = '';
      let loadedFormation = '4-3-3';
      const playerLines: string[] = [];

      for (const line of lines) {
        if (line.startsWith('teamName:')) {
          loadedTeamName = line.substring('teamName:'.length).trim();
        } else if (line.startsWith('manager:')) {
          loadedManager = line.substring('manager:'.length).trim();
        } else if (line.startsWith('formation:')) {
          loadedFormation = line.substring('formation:'.length).trim();
        } else if (line.startsWith('players:')) {
        } else if (line.includes(':')) {
          playerLines.push(line);
        }
      }

      setTeamName(loadedTeamName);
      setManager(loadedManager);
      setFormation(loadedFormation);
      setPlayerText(playerLines.join('\n'));
    } catch (error) {
      console.error('Failed to load sample data:', error);
      alert('サンプルデータの読み込みに失敗しました');
    }
  };

  return (
    <div className="team-input">
      <h2>{title}</h2>

      {sampleDataFile && (
        <div className="form-group">
          <button type="button" onClick={loadSampleData} className="sample-load-button">
            サンプルデータを読み込む
          </button>
        </div>
      )}

      <div className="form-group">
        <label htmlFor={`team-name-${title}`}>チーム名</label>
        <input
          id={`team-name-${title}`}
          type="text"
          value={teamName}
          onChange={(e) => handleTeamNameChange(e.target.value)}
          placeholder="例: マンチェスター・シティ"
        />
      </div>

      <div className="form-group">
        <label htmlFor={`manager-${title}`}>監督名</label>
        <input
          id={`manager-${title}`}
          type="text"
          value={manager}
          onChange={(e) => handleManagerChange(e.target.value)}
          placeholder="例: ペップ・グアルディオラ"
        />
      </div>

      <div className="form-group">
        <label htmlFor={`formation-${title}`}>フォーメーション</label>
        <select
          id={`formation-${title}`}
          value={formation}
          onChange={(e) => handleFormationChange(e.target.value)}
        >
          <option value="4-3-3">4-3-3</option>
          <option value="4-4-2">4-4-2</option>
          <option value="3-5-2">3-5-2</option>
          <option value="4-2-3-1">4-2-3-1</option>
          <option value="3-4-3">3-4-3</option>
          <option value="5-3-2">5-3-2</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor={`players-${title}`}>
          選手リスト（各行にポジション: 選手名の形式で入力）
        </label>
        <textarea
          id={`players-${title}`}
          value={playerText}
          onChange={(e) => handlePlayerTextChange(e.target.value)}
          rows={13}
          placeholder="例:\nGK:ジャンルイジ・ドンナルンマ\n右SB:リコ・ルイス"
          className="player-textarea"
        />
        <div className="player-count">
          入力済み選手数: {parsePlayerInput(playerText, formation).length} / 11
        </div>
      </div>
    </div>
  );
};

export default TeamInput;
