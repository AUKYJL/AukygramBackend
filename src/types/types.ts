export interface IUserFrontendData {
	id: number;
	tagName: string;
}
export interface ISendMessage {
	message: string;
	chatId: number;
	senderId: number;
}
export interface IReadMessage {
	chatId: number;
	messageId: number;
	readerId: number;
}
