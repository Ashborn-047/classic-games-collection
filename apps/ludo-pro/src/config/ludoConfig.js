export const PLAYERS = ['RED', 'GREEN', 'YELLOW', 'BLUE'];

export const COLORS = {
  RED: '#ff2a2a',
  GREEN: '#22c55e',
  YELLOW: '#eab308',
  BLUE: '#3b82f6'
};

export const START_OFFSETS = {
  RED: 0,
  GREEN: 13,
  YELLOW: 26,
  BLUE: 39
};

export const PERIMETER_LENGTH = 52;
export const HOME_PATH_START = 52;
export const FINISH_LINE = 57;

export const SAFE_SPOTS = [0, 8, 13, 21, 26, 34, 39, 47];

export const getAbsolutePosition = (owner, relativePos) => {
  if (relativePos < 0) return -1; // Base
  if (relativePos >= HOME_PATH_START) return -2; // Home Path (Special handling)
  
  return (relativePos + START_OFFSETS[owner]) % PERIMETER_LENGTH;
};
