/**
 * Euclidean distance between two face embedding vectors
 * Lower distance = more similar faces
 * @param {number[]} arr1 - First embedding array
 * @param {number[]} arr2 - Second embedding array
 * @returns {number} Euclidean distance
 */
function euclideanDistance(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) {
    return Infinity;
  }
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    const diff = arr1[i] - arr2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

// Threshold for face match - typical face-api.js uses ~0.6 for good match
const FACE_MATCH_THRESHOLD = 0.65;

function isFaceMatch(embedding1, embedding2) {
  const distance = euclideanDistance(embedding1, embedding2);
  return {
    distance,
    matched: distance <= FACE_MATCH_THRESHOLD
  };
}

module.exports = { euclideanDistance, isFaceMatch, FACE_MATCH_THRESHOLD };
