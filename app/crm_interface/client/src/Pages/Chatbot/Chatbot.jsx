import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";
import { chatURL } from "../../apiRoutes";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const Chatbot = () => {
	const authHeader = useAuthHeader();

	const [messages, setMessages] = useState([
		{ text: "Em que posso ajudar?", sender: "bot" },
	]);
	const [input, setInput] = useState("");

	const sendMessage = async () => {
		if (!input.trim()) return;

		const newMessages = [...messages, { text: input, sender: "user" }];
		setMessages(newMessages);

		try {
			const response = await axios.post(
				chatURL,
				{ message: input },
				{
					headers: {
						Authorization: authHeader,
					},
				},
			);
			setMessages([
				...newMessages,
				{ text: response.data.reply, sender: "bot" },
			]);
		} catch (error) {
			console.error("Error sending message:", error);
		}

		setInput("");
	};

	return (
		<div className="chatbot-container mt-8">
			<div className="chatbot-messages">
				{messages.map((msg, index) => (
					<div key={index} className={`chatbot-message ${msg.sender}`}>
						{msg.text}
					</div>
				))}
			</div>
			<div className="chatbot-input">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === "Enter") {
							sendMessage();
							e.preventDefault(); // Prevents the addition of a new line in the input after pressing 'Enter'
						}
					}}
					placeholder="Escreva uma mensagem..."
				/>
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
};

export default Chatbot;
