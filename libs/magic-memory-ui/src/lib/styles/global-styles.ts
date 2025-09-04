import { roundButtonStyles } from './components/buttons';
import containerStyles from './components/containers';
import progressBarStyles from './components/progressBar';

// Добавляем типизацию для globalStyles
const globalStyles = {
  roundButton: roundButtonStyles,
  progressBar: progressBarStyles,
  containers: containerStyles, // Убедимся, что containers ссылается на containerStyles
} as const;

export default globalStyles;
