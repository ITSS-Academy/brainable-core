import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer() server: any;

  handleConnection(client: any, ...args: any[]) {
    console.log("Client connected:", client.id);
  }

  handleDisconnect(client: any) {
    console.log("Client disconnected:", client.id);
  }

  @SubscribeMessage("question")
  handleMessage(client: any, payload: any) {
    const pin = payload.pin;
    console.log("Question received:", payload);
    this.server.emit(`question-${pin}`, payload);
  }

  @SubscribeMessage("room")
  handleRoom(client: any, payload: any) {
    const pin = payload.pin;
    console.log("Room:", payload);
    this.server.emit(`room-${pin}`, payload.username);
  }
}
