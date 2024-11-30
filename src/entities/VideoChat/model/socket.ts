import { io, ManagerOptions, SocketOptions } from "socket.io-client";

const options: Partial<ManagerOptions & SocketOptions> = {
	forceNew: true,
	reconnectionAttempts: Infinity,
	timeout: 10000,
	transports: ["websocket"],
};

const socket = io(import.meta.env.VITE_API_URL, options);

export default socket;
