import React, { createContext, useContext, useState, ReactNode } from "react";
import { Audio } from "expo-av";
import {
	checkMicrophonePermission,
	requestMicrophonePermission,
} from "@/services/permissionService";

interface AudioContextType {
	startRecording: () => Promise<Audio.Recording | null>;
	stopRecording: () => Promise<string | null>;
	playAudio: (sound: Audio.Sound) => Promise<void>;
	pauseAudio: () => Promise<void>;
	stopAudio: () => Promise<void>;
	isRecording: boolean;
	isPlaying: boolean;
	sound: Audio.Sound | null;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = (): AudioContextType => {
	const context = useContext(AudioContext);
	if (!context) {
		throw new Error("useAudio must be used within an AudioProvider");
	}
	return context;
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
	const [recording, setRecording] = useState<Audio.Recording | null>(null);
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	const startRecording = async (): Promise<Audio.Recording | null> => {
		let hasPermission = await checkMicrophonePermission();
		if (!hasPermission) {
			hasPermission = await requestMicrophonePermission();
		}

		if (!hasPermission) {
			console.log("Need Microphone permission to record audio");
			return Promise.reject();
		}

		try {
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});

			const newRecording = new Audio.Recording();
			await newRecording.prepareToRecordAsync(
				Audio.RecordingOptionsPresets.HIGH_QUALITY
			);
			await newRecording.startAsync();

			setRecording(newRecording);
			setIsRecording(true);
			return newRecording;
		} catch (err) {
			console.error("Failed to start recording", err);
			throw err;
		}
	};

	const stopRecording = async (): Promise<string | null> => {
		if (!recording) {
			console.warn("No active recording to stop");
			return null;
		}

		try {
			await recording.stopAndUnloadAsync();
			const recordingUri = recording.getURI();
			setRecording(null);

			if (recordingUri) {
				const newSound = new Audio.Sound();
				await newSound.loadAsync({ uri: recordingUri });
				setSound(newSound);
			}
			setIsRecording(false);
			return recordingUri;
		} catch (error) {
			console.error("Failed to stop recording", error);
			throw error;
		}
	};

	const playAudio = async (new_sound: Audio.Sound): Promise<void> => {
		setSound(new_sound);
		if (!new_sound) {
			console.warn("No sound loaded to play");
			return;
		}
		try {
			await new_sound.playAsync();
			setIsPlaying(true);
		} catch (error) {
			console.error("Failed to play audio", error);
			throw error;
		}
	};

	const pauseAudio = async (): Promise<void> => {
		if (sound) {
			try {
				await sound.pauseAsync();
				setIsPlaying(false);
			} catch (error) {
				console.error("Failed to pause audio", error);
				throw error;
			}
		}
	};

	const stopAudio = async (): Promise<void> => {
		if (sound) {
			try {
				await sound.stopAsync();
				setIsPlaying(false);
			} catch (error) {
				console.error("Failed to stop audio", error);
				throw error;
			}
		}
	};

	return (
		<AudioContext.Provider
			value={{
				startRecording,
				stopRecording,
				playAudio,
				pauseAudio,
				stopAudio,
				isRecording,
				isPlaying,
				sound,
			}}>
			{children}
		</AudioContext.Provider>
	);
};
