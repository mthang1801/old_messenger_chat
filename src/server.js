import express from "express" ;
import connectDB from "./config/connectDB";
import initialRoutes from "./routes/web";
import configViewEngine from "./config/viewEngine";
import connectFlash from "connect-flash";
import bodyParser from "body-parser";
import configSession from "./config/session";
import passport from "passport";
import pem from "pem";
import https from "https";
import cookieParser from "cookie-parser" ;
import http from "http" ;
import socketio from "socket.io";
import configSocketIO from "./config/socketio";
import initSocketsIO from "./sockets/index";
import events from "events";
import * as appConfig from "./config/common";

events.EventEmitter.defaultMaxListeners = appConfig.app.max_event_listener ;
let app = express();
let server = http.createServer(app);
let io = socketio(server);
//Config connect DB
connectDB();

//Config session
configSession.config(app);

//Config view engine
configViewEngine(app);

//Enable post data for request
app.use(bodyParser.urlencoded({extended : true }));

//Enable cookieParser
app.use(cookieParser());

//Enable flash message
app.use(connectFlash());

//Enable passport controller
app.use(passport.initialize());
app.use(passport.session());

//Config Socketio
configSocketIO(io , cookieParser , configSession.sessionStore);

//Imit sockets.io
initSocketsIO(io);

//Init all routes
initialRoutes(app);

server.listen(process.env.APP_PORT , process.env.APP_HOST , () => console.log(`Server is running on port ${process.env.APP_PORT} , host : ${process.env.APP_HOST}`))