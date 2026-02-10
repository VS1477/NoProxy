/**
 * Fraud scoring constants (from spec)
 * - Outside radius → +40
 * - Face mismatch → +50
 * - Same device multiple accounts → +30
 * If fraudScore > 60 → status = Suspicious
 * If fraudScore > 100 or critical → Rejected
 */

const FRAUD_OUTSIDE_RADIUS = 40;
const FRAUD_FACE_MISMATCH = 50;
const FRAUD_SAME_DEVICE = 30;
const SUSPICIOUS_THRESHOLD = 60;
const REJECTED_THRESHOLD = 100;

function computeFraudScore(reasons) {
  let score = 0;
  const fraudReasons = [];

  if (reasons.outsideRadius) {
    score += FRAUD_OUTSIDE_RADIUS;
    fraudReasons.push('Outside allowed classroom radius');
  }
  if (reasons.faceMismatch) {
    score += FRAUD_FACE_MISMATCH;
    fraudReasons.push('Face does not match registered profile');
  }
  if (reasons.sameDeviceMultipleAccounts) {
    score += FRAUD_SAME_DEVICE;
    fraudReasons.push('Same device used by multiple accounts');
  }

  let status = 'Present';
  if (score > REJECTED_THRESHOLD || (reasons.faceMismatch && reasons.outsideRadius)) {
    status = 'Rejected';
  } else if (score > SUSPICIOUS_THRESHOLD || score > 0) {
    status = 'Suspicious';
  }
  if (score === 0) status = 'Present';

  return { fraudScore: score, fraudReasons, status };
}

module.exports = {
  FRAUD_OUTSIDE_RADIUS,
  FRAUD_FACE_MISMATCH,
  FRAUD_SAME_DEVICE,
  SUSPICIOUS_THRESHOLD,
  REJECTED_THRESHOLD,
  computeFraudScore
};
