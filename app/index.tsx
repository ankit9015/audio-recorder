import Message from "@/components/Message";
import MessageEditor from "@/components/MessageEditor";
import {
	MessageModel,
	MessageProvider,
	useMessage,
} from "@/context/messageContext";
import {
	FlatList,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AudioProvider } from "@/context/audioContext";

const App = () => {
	const { messages, addMessage, removeMessage } = useMessage();

	const sendMessage = (message: Partial<MessageModel>) => {
		addMessage(message);
	};
	const emptyComponent = (
		<View style={styles.introMessage}>
			<Text style={styles.introText}>
				Hi there! 👋 My name is Tratoli. How can I assist you today?
			</Text>
		</View>
	);
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Ionicons name="menu" size={24} color="#fff" />
				<Text style={styles.headerTitle}>Travel GPT</Text>
			</View>

			<FlatList
				data={messages}
				renderItem={({ item }) => (
					<Message
						key={item.id}
						message={item}
						remove={removeMessage}></Message>
				)}
				keyExtractor={(item) => item.id.toString()}
				contentContainerStyle={styles.chatArea}
				ListEmptyComponent={emptyComponent}
			/>
			<View style={{ margin: 12 }}>
				<MessageEditor sendMessage={sendMessage}></MessageEditor>
			</View>
		</SafeAreaView>
	);
};

export default function Index() {
	return (
		<AudioProvider>
			<MessageProvider>
				<App />
			</MessageProvider>
		</AudioProvider>
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
		gap: 20,
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
});
