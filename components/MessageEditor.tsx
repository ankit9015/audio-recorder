import React, { useState } from "react";
import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AudioRecorderComponent from "./AudioRecorder"; // Assuming AudioRecorderComponent is imported
import { MessageModel } from "@/context/messageContext";
import AudioPlayerComponent from "./AudioPlayer";

interface MessageEditorProps {
	sendMessage: (message: Partial<MessageModel>) => void;
}

const MessageEditor: React.FC<MessageEditorProps> = ({ sendMessage }) => {
	const [isRecording, setIsRecording] = useState(false);
	const [message, setMessage] = useState<Partial<MessageModel>>({
		text: "",
		audioUri: undefined,
	});

	const handleNewRecording = (uri: string) => {
		setMessage({ ...message, audioUri: uri });
	};

	const handleStartRecording = () => {
		setIsRecording(true);
	};

	const handleStopRecording = () => {
		setIsRecording(false);
	};

	const send = () => {
		sendMessage(message);
		setMessage({ text: "", audioUri: undefined });
	};

	return (
		<View style={styles.container}>
			{message.audioUri && (
				<AudioPlayerComponent
					audioUri={message.audioUri}></AudioPlayerComponent>
			)}
			<View style={styles.inputArea}>
				{isRecording ? (
					<AudioRecorderComponent
						onNewRecording={handleNewRecording}
						onStartRecording={handleStartRecording}
						onStopRecording={handleStopRecording}
					/>
				) : (
					<>
						<TextInput
							style={styles.textInput}
							placeholder="Ask anything..."
							placeholderTextColor="#aaa"
							value={message.text}
							onChangeText={(text) => setMessage({ ...message, text })}
						/>
						{message.audioUri == undefined && (
							<AudioRecorderComponent
								onNewRecording={handleNewRecording}
								onStartRecording={handleStartRecording}
								onStopRecording={handleStopRecording}
							/>
						)}
						<TouchableOpacity style={styles.sendButton} onPress={send}>
							<Ionicons name="arrow-up-circle" size={32} color="#000" />
						</TouchableOpacity>
					</>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		backgroundColor: "#dbdbdb",
		borderRadius: 10,
		gap: 5,
	},
	inputArea: {
		flexDirection: "row",
		alignItems: "center",
	},
	textInput: {
		flex: 1,
		backgroundColor: "#f2f2f2",
		color: "#000",
		padding: 10,
		borderRadius: 5,
		marginHorizontal: 10,
	},
	sendButton: {
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
});

export default MessageEditor;
