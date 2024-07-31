import socketio from "socket.io-client";
import React from "react";
import { API_URL } from "../statics/constants";
export const socket = "";
// export const socket = socketio.connect(""); //API_URL
export const SocketContext = React.createContext();
