export function getTimeString(value: number | undefined) {
  if (value !== undefined) {
    const delta = new Date(value * 1000);
    const hours = delta.getUTCHours();
    const days = Math.floor(hours / 24);

    const minutes = delta.getUTCMinutes();
    const seconds = delta.getUTCSeconds();
    const lhz = hours < 10 ? '0' : '';
    const lmz = minutes < 10 ? '0' : '';
    if (days !== 0) {
      return `${days} ${lhz}${hours}:${lmz}${minutes}`;
    }
    return `${lhz + hours}:${lmz}${minutes}`;
  }
  return '';
}
