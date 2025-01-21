import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Message {
	id: number;
	text: string | null;
	audioUri: string | null;
}

interface MessageContextType {
	messages: Message[];
	addMessage: (text: string, audioUri: string) => void;
	removeMessage: (id: number) => void;
}

interface MessageProviderProps {
	children: ReactNode;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessage = (): MessageContextType => {
	const context = useContext(MessageContext);
	if (!context) {
		throw new Error("useMessage must be used within a MessageProvider");
	}
	return context;
};

export const MessageProvider: React.FC<MessageProviderProps> = ({
	children,
}) => {
	const [messages, setMessages] = useState<Message[]>([]);

	const addMessage = (text: string, audioUri: string) => {
		const newMessage: Message = {
			id: messages.length,
			text: text,
			audioUri: audioUri,
		};
		setMessages((prevMessages) => [...prevMessages, newMessage]);
	};

	const removeMessage = (id: number) => {
		const message = messages.find((x) => x.id == id);
		if (!message) {
			return;
		}
		setMessages(messages.filter((x) => x.id != id));
	};

	return (
		<MessageContext.Provider
			value={{
				messages,
				addMessage,
				removeMessage,
			}}>
			{children}
		</MessageContext.Provider>
	);
};
