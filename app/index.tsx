import Message from "@/components/Message";
import MessageEditor from "@/components/MessageEditor";
import {
	MessageModel,
	MessageProvider,
	useMessage,
} from "@/context/messageContext";
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
	const { messages, addMessage, removeMessage } = useMessage();

	const sendMessage = (message: Partial<MessageModel>) => {
		addMessage(message);
	};
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Ionicons name="menu" size={24} color="#fff" />
				<Text style={styles.headerTitle}>Travel GPT</Text>
			</View>

			<ScrollView style={styles.chatArea}>
				{messages.length == 0 && (
					<View style={styles.introMessage}>
						<Text style={styles.introText}>
							Hi there! 👋 My name is Tratoli. How can I assist you today?
						</Text>
					</View>
				)}

				{messages.map((message, index) => (
					<Message
						key={message.id}
						message={message}
						remove={removeMessage}></Message>
				))}
			</ScrollView>
			<View style={{ margin: 12 }}>
				<MessageEditor sendMessage={sendMessage}></MessageEditor>
			</View>
		</SafeAreaView>
	);
};

export default function Index() {
	return (
		<MessageProvider>
			<App />
		</MessageProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 15,
	},
	headerTitle: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
		position: "absolute",
		left: "50%",
		transform: "translateX(-50%)",
	},
	chatArea: {
		flex: 1,
		padding: 10,
	},
	introMessage: {
		backgroundColor: "transparent",
		marginBottom: 10,
		marginHorizontal: "auto",
		marginTop: "10%",
		width: "70%",
	},
	introText: {
		color: "#fff",
		fontSize: 16,
		textAlign: "center",
	},
	options: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 20,
	},
	optionButton: {
		backgroundColor: "#4CAF50",
		padding: 10,
		borderRadius: 8,
		marginRight: 5,
		marginBottom: 5,
	},
	optionText: {
		color: "#fff",
		fontSize: 14,
	},
	inputArea: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		backgroundColor: "#333",
		borderRadius: 20,
		margin: 10,
	},
	textInput: {
		flex: 1,
		color: "#fff",
		fontSize: 16,
	},
	sendButton: {
		marginLeft: 10,
	},
	recordingControls: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		padding: 10,
	},
	recordButton: {
		backgroundColor: "red",
		padding: 15,
		borderRadius: 30,
	},
});
