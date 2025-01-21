import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "@/context/audioContext";
import { Audio } from "expo-av";
import * as Progress from "react-native-progress";

interface AudioPlayerProps {
	audioUri: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUri }) => {
	const { playAudio, pauseAudio, sound: currentSound } = useAudio();
	const [isPlaying, setIsPlaying] = useState(false);
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [duration, setDuration] = useState(0);
	const [position, setPosition] = useState(0);
	const animationFrameId = useRef<number | null>(null);

	useEffect(() => {
		const loadSound = async () => {
			try {
				const newSound = new Audio.Sound();
				await newSound.loadAsync(
					{ uri: audioUri },
					{ androidImplementation: "MediaPlayer" }
				);
				setSound(newSound);

				const status = await newSound.getStatusAsync();
				if (status.isLoaded) {
					setDuration(status.durationMillis || 0);
				}

				// List playback status and update position
				newSound.setOnPlaybackStatusUpdate((status) => {
					if (status.isLoaded) {
						if (status.didJustFinish) {
							setPosition(0);
							setIsPlaying(false);
						} else {
							setPosition(status.positionMillis || 0);
						}
					}
				});
			} catch (error) {
				console.error("Failed to load sound", error);
			}
		};

		if (audioUri) {
			loadSound();
		}

		return () => {
			if (sound) {
				sound.unloadAsync();
			}
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [audioUri]);

	useEffect(() => {
		const updatePosition = async () => {
			try {
				if (sound) {
					const status = await sound.getStatusAsync();
					if (status.isLoaded) {
						setPosition(status.positionMillis || 0);
					}
				}
			} catch (error) {
				console.error("Failed to update position", error);
			}

			animationFrameId.current = requestAnimationFrame(updatePosition);
		};

		if (sound && isPlaying) {
			animationFrameId.current = requestAnimationFrame(updatePosition);
		}

		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current);
			}
		};
	}, [sound, isPlaying]);

	useEffect(() => {
		if (currentSound !== sound) {
			setPosition(0);
			setIsPlaying(false);
		}
	}, [currentSound, sound]);

	const handlePlayPause = async () => {
		if (!sound) return;

		try {
			if (isPlaying) {
				await pauseAudio();
			} else {
				await playAudio(sound);
			}
			setIsPlaying(!isPlaying);
		} catch (error) {
			console.error("Failed to play/pause sound", error);
		}
	};

	const formatTime = (millis: number): string => {
		const minutes = Math.floor(millis / 60000);
		const seconds = ((millis % 60000) / 1000).toFixed(0);
		return `${minutes}:${seconds.padStart(2, "0")}`;
	};

	return (
		<View style={styles.audioPlayer}>
			<TouchableOpacity
				onPress={handlePlayPause}
				style={styles.playPauseButton}>
				<Ionicons
					name={isPlaying ? "pause-circle" : "play-circle"}
					size={36}
					color="#fff"
				/>
			</TouchableOpacity>

			<View style={styles.waveformContainer}>
				<Text style={styles.progressText}>
					{formatTime(position)} / {formatTime(duration)}
				</Text>
				<Progress.Bar
					progress={duration ? position / duration : 0}
					width={null}
					height={4}
					color="white"
					unfilledColor="#444"
					borderColor="transparent"
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	audioPlayer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#333",
		padding: 5,
		borderRadius: 10,
	},
	playPauseButton: {
		marginRight: 10,
	},
	waveformContainer: {
		flex: 1,
		height: 50,
		justifyContent: "center",
		marginRight: 10,
		gap: 5,
	},
	progressText: {
		color: "#fff",
		fontSize: 12,
	},
});

export default AudioPlayer;
