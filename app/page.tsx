"use client";

import { useEffect, useState } from "react";

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

  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [answerTime, setAnswerTime] = useState(5);

  useEffect(() => {
    if (isGameFinished) return;

    const interval = setInterval(() => {
      setAnswerTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameFinished, currentQuestion]);

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

  return (
    <div className="flex flex-col h-screen justify-center items-center text-xl w-[400px] mx-auto">
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
              onClick={goToNextQuestion}
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}
