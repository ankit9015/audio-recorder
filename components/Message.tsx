import React, { useState } from "react";
import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MessageModel } from "@/context/messageContext";
import AudioPlayer from "./AudioPlayer";

interface MessageProps {
	message: MessageModel;
	remove: (id: number) => void;
}

const Message: React.FC<MessageProps> = ({ message, remove }) => {
	return (
		<View style={styles.container}>
			<View style={styles.main}>
				{message.audioUri && (
					<AudioPlayer audioUri={message.audioUri}></AudioPlayer>
				)}
				<Text style={styles.messageText}>{message.text}</Text>
			</View>

			<TouchableOpacity
				onPress={() => remove(message.id as number)}
				style={styles.deleteButton}>
				<Ionicons name="trash" size={24} color="#fff" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		backgroundColor: "#dbdbdb",
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},
	main: {
		flexGrow: 1,
	},
	messageText: {
		color: "#000",
		padding: 10,
	},
	deleteButton: {
		marginLeft: 10,
	},
});

export default Message;
