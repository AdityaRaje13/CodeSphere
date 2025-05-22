const express = require("express");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const projectModel = require('./Models/project.model');

const authRouter = require("./Routes/auth.route");
const msgRouter = require("./Routes/message.route");
const profileRouter = require("./Routes/profile.route");
const projectRouter = require("./Routes/project.route"); 
const aiRouter = require("./Routes/ai.routes");

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config();

const connection = require("./config/db");
const { Socket } = require("socket.io");

// cors
const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST, DELETE, PUT, PATCH, HEAD",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());

const port = process.env.PORT;

// Important middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter, msgRouter, profileRouter, projectRouter, aiRouter);

// Socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }

        // Fetch project from DB
        socket.project = await projectModel.findById(projectId);

        if (!socket.project) {
            return next(new Error('Project not found'));
        }

        // Check token exists
        if (!token) {
            return next(new Error('Authorization error'));
        }

        // Verify token
        const userData = jwt.verify(token, process.env.JWT_SECRET);

        if (!userData) {
            return next(new Error('Authorization error'));
        }

        // Attach user data to socket
        socket.user = userData;        
        next();
        
    } catch (error) {
        next(error);
    }
});

io.on('connection', (socket) => { 
    console.log("A user connected");

    socket.roomID = socket.project._id.toString();
    

    // Join the project room
    if (socket.project) {
        socket.join(socket.roomID);
        console.log("Joined room:", socket.roomID);
    }


    // Listen for project messages
    socket.on('project-message', (data) => {
        if (socket.project) {
            socket.broadcast.to(socket.roomID).emit('project-message', data);
            console.log("Message data:", data);
        }
    });


    // Handling disconnect
    socket.on('disconnect', () => {
        console.log("User disconnected");
    });
});


server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
