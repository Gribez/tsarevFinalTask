// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct VoteSession {
        string question;
        string[] options;
        mapping(uint => uint) voteCounts;
        mapping(address => bool) hasVoted;
        uint endTime;
        address creator;
    }

    VoteSession[] public sessions;

    function createSession(string memory _question, string[] memory _options, uint _duration) public {
        require(_options.length > 1, "Need at least two options");
        VoteSession storage newSession = sessions.push();
        newSession.question = _question;
        newSession.options = _options;
        newSession.endTime = block.timestamp + _duration;
        newSession.creator = msg.sender;
    }

    function castVote(uint _sessionId, uint _optionIndex) public {
        require(_sessionId < sessions.length, "Invalid session ID");
        VoteSession storage session = sessions[_sessionId];
        require(block.timestamp < session.endTime, "Voting closed");
        require(!session.hasVoted[msg.sender], "Already voted");
        require(_optionIndex < session.options.length, "Invalid option");

        session.hasVoted[msg.sender] = true;
        session.voteCounts[_optionIndex]++;
    }

    function closeSession(uint _sessionId) public {
        require(_sessionId < sessions.length, "Invalid session ID");
        VoteSession storage session = sessions[_sessionId];

        require(block.timestamp >= session.endTime, "Cannot close yet");
        require(msg.sender == session.creator, "Not session creator");

        session.endTime = 0;
    }

    function getSessionResults(uint _sessionId) public view returns (string[] memory options, uint[] memory voteCounts) {
        require(_sessionId < sessions.length, "Invalid session ID");
        VoteSession storage session = sessions[_sessionId];

        options = session.options;
        voteCounts = new uint[](session.options.length);
        for (uint i = 0; i < session.options.length; i++) {
            voteCounts[i] = session.voteCounts[i];
        }
    }

    function getSessionDetails(uint _sessionId) public view returns (
        string memory question,
        string[] memory options,
        uint endTime,
        address creator
    ) {
        require(_sessionId < sessions.length, "Invalid session ID");
        VoteSession storage session = sessions[_sessionId];
        return (session.question, session.options, session.endTime, session.creator);
    }
}
