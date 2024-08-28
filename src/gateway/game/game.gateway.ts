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
  questions: {
    questionId: string;
    correctAnswer: number;
    answers: {
      [playerName: string]: {
        answer: number,
        time: number,

      }
    };

  }[];
}

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  private rooms: { [pin: string]: Room } = {};

  @SubscribeMessage("createRoom")
  handleCreateRoom(
    @MessageBody() pin: string,
    @ConnectedSocket() client: Socket
  ): void {
    this.rooms[pin] = {
      hostId: client.id,
      players: {},
      questions: []
    };
    client.join(pin);
    console.log(`Room ${pin} created by host ${client.id}`);
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoom(
    @MessageBody() data: { pin: string; username: string },
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[data.pin];
    if (room) {
      client.join(data.pin);
      room.players[client.id] = data.username;
      console.log(`${data.username} joined room ${data.pin}`);
      this.server
        .to(room.hostId)
        .emit("guestJoined", { username: data.username });
    } else {
      client.emit("error", "Room not found");
    }
  }

  @SubscribeMessage("checkRoomExist")
  handleCheckRoomExist(
    @MessageBody() pin: string,
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[pin];
    if (!room) {
      client.emit("error", "Room not found");
    } else {
      this.server.to(client.id).emit("navigateToEnterName");
      console.log(`Room ${pin} exists`);
    }
  }

  @SubscribeMessage("startGame")
  handleStartGame(
    @MessageBody() pin: string,
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[pin];
    if (room && room.hostId === client.id) {
      this.server.to(pin).emit("navigateToCountDown");
      console.log(`Game started in room ${pin}`);
    } else {
      console.log("Unauthorized: Only the host can start the game.");
      client.emit("error", "Only the host can start the game.");
    }
  }

  @SubscribeMessage("showAnswer")
  handleCountdown(
    @MessageBody() pin: string,
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[pin];
    console.log(room.hostId);
    console.log(client.id);
    if (room && room.hostId === client.id) {
      this.server.to(pin).emit("chooseAnswer");
      console.log(`Countdown started in room ${pin}`);
    } else {
      console.log("Unauthorized: Only the host can start the countdown.");
      client.emit("error", "Only the host can start the countdown.");
    }
  }

  @SubscribeMessage("sendQuestion")
  handleSendQuestion(
    @MessageBody()
      data: {
      pin: string;
      questionId: string;
      correctAnswer: number;
    },
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[data.pin];
    if (room && room.hostId === client.id) {
      // Thêm câu hỏi vào danh sách
      room.questions.push({
        questionId: data.questionId,
        correctAnswer: data.correctAnswer,
        answers: {}
      });

      // Gửi câu hỏi cho tất cả người chơi
      this.server.to(data.pin).emit("receiveQuestion", data.questionId);
      console.log(
        `Question ${data.questionId} sent to room ${data.pin} with correct answer ${data.correctAnswer}`
      );
    } else {
      console.log("Unauthorized: Only the host can send a question.");
      client.emit("error", "Only the host can send a question.");
    }
  }

  @SubscribeMessage("sendAnswer")
  handleSendAnswer(
    @MessageBody()
      data: {
      pin: string;
      questionId: string;
      playerName: string;
      answer: number;
      time: number;
    },
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[data.pin];
    let question = room.questions.find((q) => q.questionId == data.questionId);
    console.log(data);
    if (question) {
      if (!question.answers[data.playerName]) {
        question.answers[data.playerName] = { answer: 0, time: 0 };
      }
      question.answers[data.playerName].answer = data.answer;
      question.answers[data.playerName].time = data.time;

      console.log(
        `Player ${data.playerName} answered question ${data.questionId} with ${data.answer} in room ${data.pin}`
      );

      this.server.to(data.pin).emit("playerSubmittedAnswer");
    }
  }

  @SubscribeMessage("nextQuestion")
  handleNextQuestion(
    @MessageBody() pin: string,
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[pin];
    if (room && room.hostId === client.id) {
      this.server.to(pin).emit("navigateToNextQuestion");
      console.log(`Next question started in room ${pin}`);
    } else {
      console.log("Unauthorized: Only the host can start the countdown.");
      client.emit("error", "Only the host can start the countdown.");
    }
  }

  @SubscribeMessage("nextShowResults")
  handleNextShowResults(
    @MessageBody() pin: string,
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[pin];
    if (room && room.hostId === client.id) {
      this.server.to(pin).emit("navigateToResults");
      console.log(`Next show results started in room ${pin}`);
    } else {
      console.log("Unauthorized: Only the host can start the countdown.");
      client.emit("error", "Only the host can start the countdown.");
    }
  }

  @SubscribeMessage("showResults")
  handleShowResult(
    @MessageBody()
      data: {
      pin: string;
      questionId: string;
    },
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[data.pin];
    if (room && room.hostId === client.id) {
      // Tìm câu hỏi trong danh sách
      const question = room.questions.find(
        (q) => q.questionId == data.questionId
      );
      // Gửi thống kê số lượng người chơi chọn từng đáp án về cho host
      const answerStatistics = this.calculateAnswerStatistics(question);
      this.server.to(room.hostId).emit("answerStatistics", {
        answerStatistics: answerStatistics
      });

      // Gửi lại đáp án đúng cho tất cả người chơi
      this.server.to(data.pin).emit("correctAnswer", {
        correctAnswer: question.correctAnswer
      });
    } else {
      console.log("Unauthorized: Only the host can show the result.");
      client.emit("error", "Only the host can show the result.");
    }
  }

  private calculateAnswerStatistics(question: {
    questionId: string;
    correctAnswer: number;
    answers: {
      [playerName: string]: {
        answer: number,
        time: number,
      }
    };
  }) {
    const statistics: { [answer: string]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };

    Object.values(question.answers).forEach((answer) => {
      if (!statistics[answer.answer]) {
        statistics[answer.answer] = 0;
      }
      statistics[answer.answer] += 1;
    });

    return statistics;
  }

  @SubscribeMessage("endGame")
  handleEndGame(
    @MessageBody() pin: string,
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[pin];
    if (room && room.hostId === client.id) {
      const leaderboard = this.calculateLeaderboard(room);
      this.server.to(room.hostId).emit("questionList", leaderboard);
      console.log(`Game ended in room ${pin}. Leaderboard sent.`);
    } else {
      console.log("Unauthorized: Only the host can end the game.");
      client.emit("error", "Only the host can end the game.");
    }
  }

  calculateLeaderboard(room: Room) {
    const scores: { [playerName: string]: number } = {};

    room.questions.forEach((question) => {
      Object.entries(question.answers).forEach(([playerName, answerData]) => {
        if (!scores[playerName]) scores[playerName] = 0;

        // Chỉ cộng điểm nếu câu trả lời đúng
        if (answerData.answer === question.correctAnswer) {
          scores[playerName] += (1 / answerData.time) * 100000;
        }
      });
    });

    // Sắp xếp bảng xếp hạng theo điểm số giảm dần và làm tròn kết quả
    return Object.entries(scores)
      .map(([playerName, score]) => ({ playerName, score: Math.round(score) }))
      .sort((a, b) => b.score - a.score);
  }


  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
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
