import { io } from "socket.io-client";

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (!projectId) {
        console.error("Project ID is required to initialize socket.");
        return;
    }

    socketInstance = io("http://localhost:2000", {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId,
        }
    });

    socketInstance.on('connect', () => {
        console.log(`Socket connected to project ${projectId}`);
    });

    socketInstance.on('connect_error', (err) => {
        console.error(`Socket connection error: ${err.message}`);
    });

    socketInstance.on('disconnect', () => {
        console.log("Socket disconnected");
    });
};


//Recieve Message
export const recieveMessage = (eventName, cb) => {

    if (!socketInstance) {
        console.error("Socket instance is not initialized!");
        return;
    }
    
    console.log(`Listening to event: ${eventName}`);
    socketInstance.on(eventName, data => {
        console.log(`Message received on event: ${eventName}`);
        cb(data);
    });
};



//Send Message
export const sendMessage = (eventName, data) => {
    if (!socketInstance) {
        console.error("Socket instance is not initialized!");
        return;
    }

    socketInstance.emit(eventName, data);
    console.log(`Message sent on event: ${eventName}`, data);
};



