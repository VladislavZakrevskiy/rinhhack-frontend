import { Stack } from "@fluentui/react";
import { Button, Text } from "@fluentui/react-components";
import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

// Настройка сервера
const SOCKET_SERVER_URL = "http://localhost:8000";

// Типы данных
interface RemoteStreams {
	[key: string]: MediaStream;
}

interface Offer {
	type: "offer";
	offer: RTCSessionDescriptionInit;
}

interface Answer {
	type: "answer";
	answer: RTCSessionDescriptionInit;
}

interface Candidate {
	type: "candidate";
	candidate: RTCIceCandidate;
}

export const VideoChat: React.FC = () => {
	const [room, setRoom] = useState<string>("");
	const [connected, setConnected] = useState<boolean>(false);
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStreams, setRemoteStreams] = useState<RemoteStreams>({});
	const [speakingUser, setSpeakingUser] = useState<string | null>(null); // Кто говорит

	const socket = useRef<Socket | null>(null);
	const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
	const localVideoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		socket.current = io(SOCKET_SERVER_URL);

		socket.current.on("connect", () => {
			setConnected(true);
		});

		socket.current.on("user_joined", ({ user }) => {
			console.log(`${user} joined the room`);
			startConnection(user);
		});

		socket.current.on("signal", async ({ message, from }) => {
			if (message.type === "offer") {
				await handleOffer(message, from);
			} else if (message.type === "answer") {
				await handleAnswer(message, from);
			} else if (message.type === "candidate") {
				await handleCandidate(message, from);
			}
		});

		socket.current.on("user_speaking", (user: string) => {
			setSpeakingUser(user);
		});

		return () => {
			socket.current?.disconnect();
		};
	}, []);

	const startConnection = (user: string) => {
		const peerConnection = new RTCPeerConnection();
		peerConnections.current[user] = peerConnection;

		localStream?.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

		peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				socket.current?.emit("signal", {
					target: user,
					message: { type: "candidate", candidate: event.candidate },
				});
			}
		};

		peerConnection.ontrack = (event) => {
			const remoteStream = event.streams[0];
			setRemoteStreams((prev) => ({ ...prev, [user]: remoteStream }));
		};

		createOffer(user);
	};

	const createOffer = async (user: string) => {
		const peerConnection = peerConnections.current[user];
		const offer = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(offer);

		socket.current?.emit("signal", {
			target: user,
			message: { type: "offer", offer: offer },
		});
	};

	const handleOffer = async (offer: Offer, from: string) => {
		const peerConnection = peerConnections.current[from] || new RTCPeerConnection();
		peerConnections.current[from] = peerConnection;

		await peerConnection.setRemoteDescription(new RTCSessionDescription(offer.offer));
		const answer = await peerConnection.createAnswer();
		await peerConnection.setLocalDescription(answer);

		socket.current?.emit("signal", {
			target: from,
			message: { type: "answer", answer: answer },
		});

		peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				socket.current?.emit("signal", {
					target: from,
					message: { type: "candidate", candidate: event.candidate },
				});
			}
		};

		peerConnection.ontrack = (event) => {
			const remoteStream = event.streams[0];
			setRemoteStreams((prev) => ({ ...prev, [from]: remoteStream }));
		};
	};

	const handleAnswer = async (answer: Answer, from: string) => {
		const peerConnection = peerConnections.current[from];
		await peerConnection.setRemoteDescription(new RTCSessionDescription(answer.answer));
	};

	const handleCandidate = async (candidate: Candidate, from: string) => {
		const peerConnection = peerConnections.current[from];
		try {
			await peerConnection.addIceCandidate(new RTCIceCandidate(candidate.candidate));
		} catch (err) {
			console.error("Error adding ICE candidate:", err);
		}
	};

	const joinRoom = () => {
		if (room) {
			socket.current?.emit("join_room", room);
			navigator.mediaDevices
				.getUserMedia({ video: true, audio: true })
				.then((stream) => {
					setLocalStream(stream);
					if (localVideoRef.current) {
						// Приводим к типу HTMLVideoElement
						(localVideoRef.current as HTMLVideoElement).srcObject = stream;
					}
				})
				.catch((err) => console.error("Error accessing media devices:", err));
		}
	};

	return (
		<div>
			<h1>Chat</h1>
			<Stack tokens={{ childrenGap: 10 }}>
				<Text>{connected ? "Connected to server" : "Connecting..."}</Text>

				<input type="text" placeholder="Enter room name" value={room} onChange={(e) => setRoom(e.target.value)} />
				<Button onClick={joinRoom}>Join Room</Button>

				<div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
					{speakingUser && remoteStreams[speakingUser] && (
						<video
							key={speakingUser}
							autoPlay
							width="80%"
							ref={(el) => el && (el.srcObject = remoteStreams[speakingUser])}
							style={{ border: "2px solid #ddd", borderRadius: "10px" }}
						/>
					)}
				</div>

				<div style={{ display: "flex", overflowX: "auto", gap: "10px", padding: "10px" }}>
					{Object.keys(remoteStreams).map(
						(user) =>
							user !== speakingUser && (
								<video
									key={user}
									autoPlay
									width="150"
									ref={(el) => el && (el.srcObject = remoteStreams[user])}
									style={{
										border: "2px solid #ddd",
										borderRadius: "10px",
										minWidth: "150px",
									}}
								/>
							),
					)}
				</div>
			</Stack>
		</div>
	);
};
