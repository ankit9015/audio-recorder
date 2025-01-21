import React from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudio } from "@/context/audioContext";

interface AudioRecorderProps {
	onNewRecording: (uri: string) => void;
	onStartRecording?: () => void;
	onStopRecording?: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
	onNewRecording,
	onStartRecording,
	onStopRecording,
}) => {
	const { startRecording, stopRecording, isRecording } = useAudio();
	const handleRecordPress = async (event: GestureResponderEvent) => {
		try {
			if (isRecording) {
				const uri = await stopRecording();
				if (uri) {
					onNewRecording(uri);
					onStopRecording && onStopRecording();
				}
			} else {
				await startRecording();
				onStartRecording && onStartRecording();
			}
		} catch (error) {
			console.error("Error handling record press:", error);
		}
	};

	return (
		<View style={styles.container}>
			{!isRecording && (
				<TouchableOpacity
					onPress={handleRecordPress}
					style={styles.recordButton}>
					<Ionicons name="mic" size={24} color="#000" />
				</TouchableOpacity>
			)}
			{isRecording && (
				<TouchableOpacity onPress={handleRecordPress} style={styles.stopButton}>
					<Ionicons name="stop-circle" size={24} color="#000" />
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
	},
	recordButton: {},
	stopButton: {},
});

export default AudioRecorder;
