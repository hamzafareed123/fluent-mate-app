import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { useCallback, useRef, useState } from 'react';

import { transcribeAudio } from '@/lib/api/ai';

export function useAudioRecorder() {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [durationMs, setDurationMs] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const requestPermission = useCallback(async () => {
    const { status } = await Audio.requestPermissionsAsync();
    const granted = status === 'granted';
    setPermissionGranted(granted);
    if (!granted) {
      setError('Microphone permission is required to practise speaking.');
    }
    return granted;
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    const granted = permissionGranted ?? (await requestPermission());
    if (!granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();
    recordingRef.current = recording;
    setIsRecording(true);
    setDurationMs(0);
    timerRef.current = setInterval(() => setDurationMs((d) => d + 1000), 1000);
  }, [permissionGranted, requestPermission]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    const recording = recordingRef.current;
    if (!recording) return null;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);

      if (!uri) return null;

      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });

      await FileSystem.deleteAsync(uri, { idempotent: true });

      const { text } = await transcribeAudio(base64, 'audio/m4a');
      return text?.trim() || null;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Recording failed');
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return null;
    }
  }, []);

  const cancelRecording = useCallback(async () => {
    const recording = recordingRef.current;
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch {
      // ignore cleanup errors
    }
    recordingRef.current = null;
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    isRecording,
    durationMs,
    permissionGranted,
    error,
    requestPermission,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
