import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {Body} from "@nestjs/common";

interface Room {
  hostId: string;
  isStarted: boolean;
  players: { [socketId: string]: string };
  questions: {
    questionId: string;
    correctAnswer: number;
    timeLimit: number;
    points: number;
    answers: {
      [playerId: string]: {
        answer: number,
        time: number,
        score: number
      }
    };

  }[];
}

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  private score: {[playerId: string]:{
      playerName: string,
      score: number
    }};

  private rooms: { [pin: string]: Room } = {};
  private currentQuestion: number = 0;

  @SubscribeMessage("createRoom")
  handleCreateRoom(
    @MessageBody() pin: string, data: string,
    @ConnectedSocket() client: Socket
  ): void {
    this.rooms[pin] = {
      hostId: client.id,
      isStarted: false,
      players: {},
      questions: [],
    }
    client.join(pin);
    console.log(`Room ${pin} created by host ${client.id}`);
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoom(
    @MessageBody() data: { pin: string; username: string },
    @ConnectedSocket() client: Socket
  ): void {
    let playerId = String(client.id);
    const room = this.rooms[data.pin];
    if (room) {
      if (room.isStarted !== true) {
        client.join(data.pin);
        room.players[playerId] = data.username;
        console.log(`${data.username} joined room ${data.pin}`);
        this.server
          .to(room.hostId)
          .emit("guestJoined", {username: data.username, playerId: playerId});
        client.emit("clientGuessJoined","Guest joined room");
      }else {
        client.emit("error", "Game has already started");
      }

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
      if (room.isStarted == true) {
        client.emit("error", "Game has already started");
      }else {
        console.log(room)
        this.server.to(client.id).emit("navigateToEnterName",client.id);
        console.log(`Room ${pin} exists`);
      }
    }
  }

  @SubscribeMessage("startGame")
  handleStartGame(
    @MessageBody() pin: string,
    @ConnectedSocket() client: Socket
  ): void {
    let room = this.rooms[pin];
    this.rooms[pin].isStarted = true;

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
      points: number;
      timeLimit: number;
    },
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[data.pin];
    if (room && room.hostId === client.id) {
      // Thêm câu hỏi vào danh sách
      room.questions.push({
        questionId: data.questionId,
        correctAnswer: data.correctAnswer,
        points: data.points,
        timeLimit: data.timeLimit,
        answers: {
        },
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
    try {

      const room = this.rooms[data.pin];
      if (!room) {
        // client.emit("error", "Room not exist");
        return;
      }

      const question = room.questions.find(
        (q) => q.questionId === data.questionId
      );
      if (!question) {
        client.emit("error", "Question not found");
        return;
      }

      if (!question.answers[data.playerName]) {
        question.answers[data.playerName] = { answer: 0, time: 0, score: 0 };
      }
      console.log(client.id);
      console.log(question.answers[data.playerName]);

      question.answers[data.playerName].answer = data.answer;
      question.answers[data.playerName].time = data.time;

      if (question.correctAnswer === data.answer) {
        // const newScore = Math.round((1 / data.time) * 100000);
        let newScore = 0;
        if (data.time <= 500) {
          newScore = 1000;
          client.emit("sendScore", newScore);
        }else {
          newScore = Math.round(((1 - ((data.time / (room.questions[this.currentQuestion].timeLimit * 1000)) / 2)) * 1000) * room.questions[this.currentQuestion].points);
            client.emit("sendScore", newScore);
        }
        if (this.currentQuestion === 0) {
          question.answers[data.playerName].score = newScore;
        } else {
          const previousScore = room.questions[this.currentQuestion - 1].answers[data.playerName]?.score || 0;
          const totalScore = newScore + previousScore;

          // Ensure the total score does not exceed the maximum safe integer value
          if (totalScore > Number.MAX_SAFE_INTEGER) {
            question.answers[data.playerName].score = Number.MAX_SAFE_INTEGER;
          } else {
            question.answers[data.playerName].score = totalScore;
          }
        }
      } else {
        client.emit("sendScore", 0);
        if (this.currentQuestion === 0) {
          question.answers[data.playerName].score = 0;
        } else {
          question.answers[data.playerName].score = room.questions[this.currentQuestion - 1].answers[data.playerName]?.score || 0;

        }
      }
      console.log(question.answers);
      console.log("final test")
      console.log(question.answers[data.playerName].answer);
      if (question.answers[data.playerName].answer == 0 && this.currentQuestion > 0) {
        console.log(room.questions[this.currentQuestion - 1].answers[data.playerName].score);
        this.rooms[data.pin].questions[this.currentQuestion].answers[data.playerName].score = room.questions[this.currentQuestion - 1].answers[data.playerName].score ;
        console.log(this.rooms[data.pin].questions[this.currentQuestion].answers[data.playerName]);
      }
      this.server.to(data.pin).emit("playerSubmittedAnswer");
    } catch (error) {
      console.log(error);
      client.emit("error", "An error occurred while processing the answer");
    }
  }



  @SubscribeMessage("nextQuestion")
  handleNextQuestion(
    @MessageBody() pin: string,
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[pin];
    this.currentQuestion++;
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
    console.log("1231231232141203kjasndfkjndsakjnsckvjnzxckjvn")
    const room = this.rooms[data.pin];
    if (room && room.hostId === client.id) {
      // Tìm câu hỏi trong danh sách
      const question = room.questions.find(
        (q) => q.questionId == data.questionId
      );
      console.log(question);
      // Gửi thống kê số lượng người chơi chọn từng đáp án về cho host
      const answerStatistics = this.calculateAnswerStatistics(question);
      this.server.to(room.hostId).emit("answerStatistics", {
        answerStatistics: answerStatistics
      });

      // Gửi lại đáp án đúng cho tất cả người chơi
      this.server.to(data.pin).emit("correctAnswer", {
        correctAnswer: question.correctAnswer
      });
      for (let player in room.players) {
          if (question.answers[player] == null || question.answers[player] == undefined ) {
            if(this.currentQuestion !== 0){
              this.rooms[data.pin].questions[this.currentQuestion].answers[player] = {
              answer: 0,
              time: 0,
              score: this.rooms[data.pin].questions[this.currentQuestion - 1].answers[player].score
            };
            }else{
              this.rooms[data.pin].questions[this.currentQuestion].answers[player] = {
                answer: 0,
                time: 0,
                score: 0
              }
            }
            this.server.to(player).emit("showScore", this.rooms[data.pin].questions[this.currentQuestion].answers[player].score);
          } else {
            this.server.to(player).emit("showScore", this.rooms[data.pin].questions[this.currentQuestion].answers[player].score);
          }// question.answers[playerName].score;

      }
      console.log(`Results shown in room ${data.pin}`,this.rooms[data.pin]);
    } else {
      console.log("Unauthorized: Only the host can show the result.");
      client.emit("error", "Only the host can show the result.");
    }
  }

  @SubscribeMessage("showTop5")
  handleShowTop10(
    @MessageBody() pin: string,
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[pin];
    if (room && room.hostId === client.id) {
      // show top 10 score in room
      let leaderboard = this.calculateLeaderboard(room);
      // if (leaderboard
      // .length > 5) {
      //   leaderboard = leaderboard.slice(0, 5);
      // }
      this.server.to(room.hostId).emit("leaderboardTop5", leaderboard);
      console.log(`Leaderboard sent to room ${pin}`);
    } else {
      console.log("Unauthorized: Only the host can show the leaderboard.");
      client.emit("error", "Only the host can show the leaderboard.");
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
      this.currentQuestion = 0;
      console.log(`Game ended in room ${pin}. Leaderboard sent.`);
    } else {
      console.log("Unauthorized: Only the host can end the game.");
      client.emit("error", "Only the host can end the game.");
    }

    // delete player Leave room
  }

  calculateLeaderboard(room: Room) {
    // get player name

    const scores: { [playerId: string]:{
        playerName: string,
        score: number
      } } = {};

    room.questions.forEach((question) => {
      Object.entries(question.answers).forEach(([playerId, answerData]) => {
        let playName = room.players[playerId];
        // Update the player's score with the score from the last question
        scores[playerId] = {
          playerName: playName,
          score: answerData.score
        };
      });
    });
    console.log(scores);

    // Sort the leaderboard by score in descending order and round the results
    let sortedScore = Object.entries(scores)
      .map(([playerId, { playerName, score }]) => ({ playerName, score: Math.round(score) }))
      .sort((a, b) => b.score - a.score);

    console.log(sortedScore);
    return sortedScore;

    this.server.to(room.hostId).emit("calculateLeaderboard", scores);
  }

  @SubscribeMessage("sendRanking")
  handleSendRanking(
    @MessageBody() pin: string,
  ) {
    let room = this.rooms[pin];
    const scores: { [playerId: string]:{
        playerName: string,
        score: number
      } } = {};

    console.log("send rankiiiiiii")
    // get player name
    room.questions.forEach((question) => {
      Object.entries(question.answers).forEach(([playerId, answerData]) => {
        let playName = room.players[playerId];
        // Update the player's score with the score from the last question
        scores[playerId] = {
          playerName: playName,
          score: answerData.score
        };
      });
    });
    console.log(scores);

// Sort the leaderboard by score in descending order and round the results
    let sortedScore = Object.entries(scores)
      .map(([playerId, { playerName, score }]) => ({ playerId, playerName, score: Math.round(score) }))
      .sort((a, b) => b.score - a.score);

// Convert sorted array back to an object with playerId as the key
    this.score = {};
    sortedScore.forEach(({ playerId, playerName, score }) => {
      this.score[playerId] = { playerName, score };
    });


    console.log("this Score",this.score);
    let rank = 1;
    for (let i in this.score) {
      console.log(i)
      this.server.to(i).emit("sendRanking", {rank: rank, score: this.score[i].score});
      rank++
    }
  }

  @SubscribeMessage("getLastQuestionScore")
  handleGetLastQuestionScore(
    @MessageBody() data: { pin: string, gameId: string },
    @ConnectedSocket() client: Socket
  ): void {
    const room = this.rooms[data.pin];
    if (room) {
      console.log(room)
      console.log("before Room")
      const results = this.getLastQuestionScore(room, data.gameId);
      console.log(results);
      this.server.to(room.hostId).emit("lastQuestionScore", results);
    } else {
      client.emit("error", "Room not found");
    }
  }

  private getLastQuestionScore(room: Room, gameId: string): {
    gameId: string,
    score: number,
    correctCount: number,
    incorrectCount: number,
    noAnswerCount: number,
    playerName: string
  }[] {
    const results = [];
    const lastQuestion = room.questions[room.questions.length - 1]; // Lấy câu hỏi cuối cùng
    const correctCounts: { [playerName: string]: number } = {};
    const incorrectCounts: { [playerName: string]: number } = {};
    const noAnswerCounts: { [playerName: string]: number } = {};

    room.questions.forEach((question) => {
      Object.entries(question.answers).forEach(([playerName, answerData]) => {
        if (answerData.answer === question.correctAnswer) {
          correctCounts[playerName] = (correctCounts[playerName] || 0) + 1;
        } else if (answerData.answer === 0) {
          noAnswerCounts[playerName] = (noAnswerCounts[playerName] || 0) + 1;
        } else {
          incorrectCounts[playerName] = (incorrectCounts[playerName] || 0) + 1;
        }
      });
    });

    // Đẩy thông tin từ câu hỏi cuối cùng vào mảng
    Object.entries(lastQuestion.answers).forEach(([playerName, answerData]) => {
      if (answerData.score > 0) {
        results.push({
          gameId,
          score: answerData.score,
          correctCount: correctCounts[playerName] || 0, // Tổng số câu đúng
          incorrectCount: incorrectCounts[playerName] || 0, // Tổng số câu sai
          noAnswerCount: noAnswerCounts[playerName] || 0, // Tổng số câu không trả lời
          playerName: room.players[playerName]
        });
      }
    });

    console.log('playerssssss',results)

    return results;
  }

  @SubscribeMessage("kickPlayer")
  handleKickPlayer(
      @MessageBody() data: { pin: string, playerId: string },
  ){
    const room = this.rooms[data.pin];
    console.log(room);
    console.log(data.playerId)
    for (const playerId in room.players) {
      if (playerId == data.playerId) {
        delete this.rooms[data.pin].players[playerId];
        console.log(`${data.playerId} has been kicked by the host`);
      }
    }
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
        this.currentQuestion = 0;
        console.log(`Room ${pin} deleted because host disconnected`);
      } else if (room.players[client.id]) {
        const username = room.players[client.id];
        // delete room.players[client.id];
          this.server.to(room.hostId).emit("guestLeft", {username: username, playerId: client.id} );
        console.log(`${username} left room ${pin}`);
      }
    }
  }
}
