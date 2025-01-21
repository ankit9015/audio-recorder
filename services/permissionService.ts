import { Audio } from "expo-av";

export const checkMicrophonePermission = async () => {
	const { status } = await Audio.getPermissionsAsync();
	return status === "granted";
};

export const requestMicrophonePermission = async () => {
	const { status } = await Audio.requestPermissionsAsync();
	return status === "granted";
}; 
