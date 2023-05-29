export const rotateTimeToStr = (rotateTime: string): string => {
  const num = parseInt(rotateTime.slice(0, -1), 10);
  const mes = rotateTime.slice(-1);
  const measure = mes === 'd' ? 'day' : 'minute';
  return `${num}-${measure}`;
};
