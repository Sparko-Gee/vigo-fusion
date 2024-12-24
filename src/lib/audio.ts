// Audio utility functions
export const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    return { mediaRecorder, chunks, stream };
  } catch (error) {
    console.error('Error accessing microphone:', error);
    throw error;
  }
};

export const stopRecording = (
  mediaRecorder: MediaRecorder | null,
  stream: MediaStream | null
) => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    stream?.getTracks().forEach(track => track.stop());
  }
};

export const createAudioBlob = (chunks: Blob[]): Blob => {
  return new Blob(chunks, { type: 'audio/webm' });
};