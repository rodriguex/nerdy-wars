"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const questions = [
    {
      id: 1,
      question: "What's SQL?",
      alternatives: [
        {
          id: 1,
          text: "Programming language",
          option: "A",
        },
        {
          id: 2,
          text: "Data structure",
          option: "B",
        },
        {
          id: 3,
          text: "Your hot mama",
          option: "C",
        },
      ],
      answer: "A",
    },
    {
      id: 2,
      question: "What's PHP?",
      alternatives: [
        {
          id: 1,
          text: "A programming language",
          option: "A",
        },
        {
          id: 2,
          text: "A data structure",
          option: "B",
        },
        {
          id: 3,
          text: "Your hot mama",
          option: "C",
        },
      ],
      answer: "A",
    },
  ];

  const [gameState, setGameState] = useState("menu");
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [answerTime, setAnswerTime] = useState(5);
  const socket = useRef<any>(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://localhost:3001");

      socket.current.on("connect", () => {
        console.log("Connected:", socket.current.id);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);

  useEffect(() => {
    if (isGameFinished || gameState === "menu") return;

    const interval = setInterval(() => {
      setAnswerTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameFinished, currentQuestion, gameState]);

  useEffect(() => {
    if (answerTime === 0) {
      goToNextQuestion();
      setAnswerTime(5);
    }
  }, [answerTime]);

  function goToNextQuestion() {
    const nextQuestionIdx =
      questions.findIndex((item) => item.id === currentQuestion.id) + 1;

    if (!questions[nextQuestionIdx]) {
      setIsGameFinished(true);
      return;
    }

    setSelectedAnswer("");
    setAnswerTime(5);
    setCurrentQuestion(
      questions[
        questions.findIndex((item) => item.id === currentQuestion.id) + 1
      ]
    );
  }

  function startGame() {
    socket.current.emit("find_room");
    socket.current.once("found_room", (response: { data: string }) => {
      console.log(response.data);
    });
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center text-xl w-[400px] mx-auto">
      {gameState === "menu" ? (
        <div className="flex flex-col">
          <h1 className="text-center font-extrabold text-4xl">NERDY WARS</h1>
          <span className="text-center">Prove you're the nerdiest one.</span>
          <button
            className="mt-10 border-4 w-full p-4 rounded-lg font-bold text-2xl cursor-pointer hover:bg-black hover:text-white"
            onClick={startGame}
          >
            START
          </button>
        </div>
      ) : (
        <div className="w-full">
          {isGameFinished ? (
            <h1 className="font-bold text-3xl text-center">Game finished</h1>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span>{currentQuestion.question}</span>
                <span className="font-bold text-2xl">{answerTime}</span>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                {currentQuestion.alternatives.map((alternative) => (
                  <span
                    key={alternative.id}
                    className={`border p-4 rounded-lg cursor-pointer ${
                      selectedAnswer === alternative.option
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => setSelectedAnswer(alternative.option)}
                  >{`${alternative.option} - ${alternative.text}`}</span>
                ))}
              </div>
              <button
                className="mt-10 border font-bold text-xl p-3 rounded-lg w-full hover:bg-black hover:text-white cursor-pointer"
                disabled={!selectedAnswer}
                onClick={goToNextQuestion}
              >
                Next
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
