import React, { createContext, useContext, useState, ReactNode } from "react";

export interface MessageModel {
	id: number | undefined;
	text: string | undefined;
	audioUri: string | undefined;
}

interface MessageContextType {
	messages: MessageModel[];
	addMessage: (message: Partial<MessageModel>) => void;
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
	const [messages, setMessages] = useState<MessageModel[]>([]);

	const addMessage = (message: Partial<MessageModel>) => {
		const newMessage: MessageModel = {
			id: messages.length + 1,
			text: message.text,
			audioUri: message.audioUri,
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
