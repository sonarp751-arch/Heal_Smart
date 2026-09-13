/**
 * Local (no-API) health biomarker scoring.
 * Returns "Low" | "Medium" | "High" based on standard reference ranges.
 */
export function scoreHealth({ glucose, cholesterol, bp, bmi, hba1c }) {
  let points = 0;

  if (glucose) {
    if (glucose > 126) points += 3;
    else if (glucose > 100) points += 1;
  }
  if (cholesterol) {
    if (cholesterol > 240) points += 2;
    else if (cholesterol > 200) points += 1;
  }
  if (bp) {
    if (bp > 140) points += 2;
    else if (bp > 130) points += 1;
  }
  if (bmi) {
    if (bmi > 30) points += 2;
    else if (bmi > 25) points += 1;
  }
  if (hba1c) {
    if (hba1c > 6.5) points += 3;
    else if (hba1c > 5.7) points += 1;
  }

  if (points >= 7) return "High";
  if (points >= 3) return "Medium";
  return "Low";
}

export const RISK_STYLES = {
  Low:    { bg: "rgba(15,110,86,0.08)",  border: "rgba(15,110,86,0.25)",  text: "#0f6e56", dot: "#0f6e56"  },
  Medium: { bg: "rgba(186,117,23,0.08)", border: "rgba(186,117,23,0.3)",  text: "#BA7517", dot: "#BA7517"  },
  High:   { bg: "rgba(163,45,45,0.08)",  border: "rgba(163,45,45,0.25)",  text: "#A32D2D", dot: "#A32D2D"  },
};
