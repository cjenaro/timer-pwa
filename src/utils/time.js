export const parseMinutes = (s) => {
  let minutes = Math.floor(s / 60);
  let seconds = (s % 60).toString();
  if (seconds.length === 1) {
    seconds = `0${seconds}`;
  }

  return `${isNaN(minutes) ? "0" : minutes}:${isNaN(seconds) ? "00" : seconds}`;
};
