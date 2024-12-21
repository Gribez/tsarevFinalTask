"use client";

import { useState } from "react";
import { CastVote, CloseSession, CreateSession } from "../components/ContractComponents";

export default function Home() {
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [closingSessionId, setClosingSessionId] = useState<number | null>(null);

  return (
    <div>
      <h1>Voting приложение</h1>
      <CreateSession />
      <hr />
      <div className="bg-green-900 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Голосование</h2>
        <input
          type="number"
          placeholder="Номер сессии"
          onChange={e => setActiveSessionId(parseInt(e.target.value))}
          className="w-full p-2 mb-4 bg-green-700 text-white rounded-lg"
        />
        {activeSessionId !== null && <CastVote sessionId={activeSessionId} />}
      </div>
      <hr />
      <div className="bg-green-900 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Закрытие сессии</h2>
        <input
          type="number"
          placeholder="Номер сессии"
          onChange={e => setClosingSessionId(parseInt(e.target.value))}
          className="w-full p-2 mb-4 bg-green-700 text-white rounded-lg"
        />
        {closingSessionId !== null && <CloseSession sessionId={closingSessionId} />}
      </div>
    </div>
  );
}
