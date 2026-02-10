/**
 * face-api.js wrapper for loading models and extracting face embeddings.
 * Models loaded from CDN. Alternatively, place in /models for offline use.
 */
import * as faceapi from 'face-api.js';

// Weights from face-api.js repo - npm package does not include them
const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  modelsLoaded = true;
}

export async function getFaceEmbedding(image) {
  await loadModels();
  const detection = await faceapi
    .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) return null;
  return Array.from(detection.descriptor);
}
