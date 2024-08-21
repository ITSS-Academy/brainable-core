import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";


interface Room {
  hostId: string;
  players: { [socketId: string]: string };
}

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  private rooms: { [pin: string]: Room } = {};

  @SubscribeMessage("createRoom")
  handleCreateRoom(@MessageBody() pin: string, @ConnectedSocket() client: Socket): void {
    this.rooms[pin] = {
      hostId: client.id,
      players: {}
    };
    client.join(pin);
    console.log(`Room ${pin} created by host ${client.id}`);
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoom(@MessageBody() data: { pin: string, username: string }, @ConnectedSocket() client: Socket): void {
    const room = this.rooms[data.pin];
    if (room) {
      room.players[client.id] = data.username;
      client.join(data.pin);
      console.log(`${data.username} joined room ${data.pin}`);
      this.server.to(room.hostId).emit("guestJoined", { username: data.username });
    } else {
      client.emit("error", "Room not found");
    }
  }

  @SubscribeMessage("startGame")
  handleStartGame(@MessageBody() pin: string, @ConnectedSocket() client: Socket): void {
    const room = this.rooms[pin];
    if (room && room.hostId === client.id) {
      this.server.to(pin).emit("navigateToQuestion");
      console.log(`Game started in room ${pin}`);
    } else {
      console.log("Unauthorized: Only the host can start the game.");
      client.emit("error", "Only the host can start the game.");
    }
  }

  // host send number of  countdown to all players
  @SubscribeMessage("countdown")
  handleCountdown(@MessageBody() data: { pin: string, countdown: number }, @ConnectedSocket() client: Socket): void {
    const room = this.rooms[data.pin];
    if (room && room.hostId === client.id) {
      this.server.to(data.pin).emit("countdown", data.countdown);
      console.log(`Countdown started in room ${data.pin}`);
    } else {
      console.log("Unauthorized: Only the host can start the countdown.");
      client.emit("error", "Only the host can start the countdown.");
    }
  }


  handleDisconnect(client: Socket) {
    for (const pin in this.rooms) {
      const room = this.rooms[pin];
      if (room.hostId === client.id) {
        delete this.rooms[pin];
        this.server.to(pin).emit("error", "Host has left the game");
        this.server.in(pin).socketsLeave(pin); // Kick all players out of the room
        console.log(`Room ${pin} deleted because host disconnected`);
      } else if (room.players[client.id]) {
        const username = room.players[client.id];
        delete room.players[client.id];
        this.server.to(room.hostId).emit("guestLeft", { username });
        console.log(`${username} left room ${pin}`);
      }
    }
  }

}
