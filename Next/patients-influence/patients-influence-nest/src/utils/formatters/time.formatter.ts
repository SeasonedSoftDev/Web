import { timeUnitMilliseconds } from '../../config/constants';

export const convertToMilliseconds = (timeString: string) => {
  const matches = timeString.match(/^(\d+)\s?([smhdw])$/);
  if (matches) {
    const number = parseInt(matches[1]);
    const unit = matches[2];
    if (timeUnitMilliseconds[unit]) {
      return number * timeUnitMilliseconds[unit];
    }
  }
  throw new Error(`Time ${timeString} cannot be decoded`);
};

// TODO implement convertToDays

export const formatTime = (timeInMs: number) => {
  let milliseconds = timeInMs;
  let seconds = 0;
  let minutes = 0;

  if (milliseconds >= 1000) {
    seconds = Math.floor(milliseconds / 1000);
    milliseconds = milliseconds % 1000;
  }

  if (seconds >= 60) {
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
  }

  return `${minutes}m ${seconds}s ${milliseconds}ms`;
};
