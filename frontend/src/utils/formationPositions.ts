export interface PositionDetail {
  label: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
}

export const FORMATION_POSITIONS: Record<string, PositionDetail[]> = {
  '4-3-3': [
    { label: 'GK', position: 'GK' },
    { label: '右SB', position: 'DF' },
    { label: '右CB', position: 'DF' },
    { label: '左CB', position: 'DF' },
    { label: '左SB', position: 'DF' },
    { label: 'DMF', position: 'MF' },
    { label: '右CMF', position: 'MF' },
    { label: '左CMF', position: 'MF' },
    { label: '右WG', position: 'FW' },
    { label: 'CF', position: 'FW' },
    { label: '左WG', position: 'FW' },
  ],
  '4-4-2': [
    { label: 'GK', position: 'GK' },
    { label: '右SB', position: 'DF' },
    { label: '右CB', position: 'DF' },
    { label: '左CB', position: 'DF' },
    { label: '左SB', position: 'DF' },
    { label: '右MF', position: 'MF' },
    { label: '右CMF', position: 'MF' },
    { label: '左CMF', position: 'MF' },
    { label: '左MF', position: 'MF' },
    { label: '右CF', position: 'FW' },
    { label: '左CF', position: 'FW' },
  ],
  '3-5-2': [
    { label: 'GK', position: 'GK' },
    { label: '右CB', position: 'DF' },
    { label: 'CB', position: 'DF' },
    { label: '左CB', position: 'DF' },
    { label: '右WB', position: 'MF' },
    { label: '右CMF', position: 'MF' },
    { label: 'DMF', position: 'MF' },
    { label: '左CMF', position: 'MF' },
    { label: '左WB', position: 'MF' },
    { label: '右CF', position: 'FW' },
    { label: '左CF', position: 'FW' },
  ],
  '4-2-3-1': [
    { label: 'GK', position: 'GK' },
    { label: '右SB', position: 'DF' },
    { label: '右CB', position: 'DF' },
    { label: '左CB', position: 'DF' },
    { label: '左SB', position: 'DF' },
    { label: '右DMF', position: 'MF' },
    { label: '左DMF', position: 'MF' },
    { label: '右OMF', position: 'MF' },
    { label: 'AMF', position: 'MF' },
    { label: '左OMF', position: 'MF' },
    { label: 'CF', position: 'FW' },
  ],
  '3-4-3': [
    { label: 'GK', position: 'GK' },
    { label: '右CB', position: 'DF' },
    { label: 'CB', position: 'DF' },
    { label: '左CB', position: 'DF' },
    { label: '右MF', position: 'MF' },
    { label: '右CMF', position: 'MF' },
    { label: '左CMF', position: 'MF' },
    { label: '左MF', position: 'MF' },
    { label: '右WG', position: 'FW' },
    { label: 'CF', position: 'FW' },
    { label: '左WG', position: 'FW' },
  ],
  '5-3-2': [
    { label: 'GK', position: 'GK' },
    { label: '右WB', position: 'DF' },
    { label: '右CB', position: 'DF' },
    { label: 'CB', position: 'DF' },
    { label: '左CB', position: 'DF' },
    { label: '左WB', position: 'DF' },
    { label: '右CMF', position: 'MF' },
    { label: 'DMF', position: 'MF' },
    { label: '左CMF', position: 'MF' },
    { label: '右CF', position: 'FW' },
    { label: '左CF', position: 'FW' },
  ],
};

export function generatePlayerTemplate(formation: string): string {
  const positions = FORMATION_POSITIONS[formation];
  if (!positions) {
    return '';
  }
  return positions.map((pos) => `${pos.label}:`).join('\n');
}

export function parsePlayerInput(
  input: string,
  formation: string
): Array<{ name: string; position: 'GK' | 'DF' | 'MF' | 'FW' }> {
  const positions = FORMATION_POSITIONS[formation];
  if (!positions) {
    return [];
  }

  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const players: Array<{ name: string; position: 'GK' | 'DF' | 'MF' | 'FW' }> = [];

  for (let i = 0; i < lines.length && i < positions.length; i++) {
    const line = lines[i];
    const colonIndex = line.indexOf(':');

    if (colonIndex !== -1) {
      const name = line.substring(colonIndex + 1).trim();
      if (name) {
        players.push({
          name,
          position: positions[i].position,
        });
      }
    }
  }

  return players;
}
