import { roundButtonStyles } from "./components/buttons";
import containerStyles from "./components/containers";
import progressBarStyles from "./components/progressBar";

const globalStyles = {
  roundButton: roundButtonStyles,
  progressBar: progressBarStyles,
  containers: containerStyles,
} as const;

export default globalStyles;
