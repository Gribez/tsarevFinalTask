import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Component for creating a new voting session
export const CreateSession = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [duration, setDuration] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "Voting",
  });

  const handleCreateSession = async () => {
    if (!question || options.length < 2 || !duration) {
      alert("Please provide valid inputs");
      return;
    }
    try {
      await writeContractAsync({
        functionName: "createSession",
        args: [question, options, BigInt(duration)],
      });
      alert("Session created successfully");
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (index: any, value: any) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  return (
    <div className="bg-green-900 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Создание сессии</h2>
      <input
        type="text"
        placeholder="Вопрос"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        className="w-full p-2 mb-4 bg-green-700 text-white rounded-lg"
      />
      <div className="mb-4">
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Ответ №${index + 1}`}
            value={option}
            onChange={e => updateOption(index, e.target.value)}
            className="w-full p-2 mb-2 bg-green-700 text-white rounded-lg"
          />
        ))}
        <button onClick={addOption} className="bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-green-700">
          Добавить ответ
        </button>
      </div>
      <input
        type="number"
        placeholder="Время действия"
        value={duration}
        onChange={e => setDuration(e.target.value)}
        className="w-full p-2 mb-4 bg-green-700 text-white rounded-lg"
      />
      <button
        onClick={handleCreateSession}
        className="bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-600"
      >
        Создать сессию
      </button>
    </div>
  );
};

export const CastVote = ({ sessionId }: { sessionId: number }) => {
  const [optionIndex, setOptionIndex] = useState("");

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "Voting",
  });

  const handleVote = async () => {
    if (optionIndex === "") {
      alert("Please select an option");
      return;
    }
    try {
      await writeContractAsync({
        functionName: "castVote",
        args: [BigInt(sessionId), BigInt(optionIndex)],
      });
      alert("Vote cast successfully");
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };

  return (
    <div className="bg-green-900 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Vote in Session {sessionId}</h2>
      <input
        type="number"
        placeholder="Индекс ответа"
        value={optionIndex}
        onChange={e => setOptionIndex(e.target.value)}
        className="w-full p-2 mb-4 bg-green-700 text-white rounded-lg"
      />
      <button
        onClick={handleVote}
        className="bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-600"
      >
        Проголосовать
      </button>
    </div>
  );
};

// Component to close a session
export const CloseSession = ({ sessionId }: { sessionId: number }) => {
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "Voting",
  });

  const handleCloseSession = async () => {
    try {
      await writeContractAsync({
        functionName: "closeSession",
        args: [BigInt(sessionId)],
      });
      alert("Session closed successfully");
    } catch (error) {
      console.error("Error closing session:", error);
    }
  };

  return (
    <div className="bg-green-900 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Close Session {sessionId}</h2>
      <button
        onClick={handleCloseSession}
        className="bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-600"
      >
        Закрыть сессию
      </button>
    </div>
  );
};
