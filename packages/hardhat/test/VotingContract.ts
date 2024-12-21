import { ethers } from "hardhat";

import { expect } from "chai";

describe("Voting Contract", function () {
  let voting: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
  });

  it("should create a new voting session", async function () {
    const question = "What is your favorite color?";
    const options = ["Red", "Blue", "Green"];
    const duration = 3600;

    await voting.createSession(question, options, duration);

    const session = await voting.sessions(0);

    expect(session.question).to.equal(question);
    expect(session.endTime).to.be.gt(Math.floor(Date.now() / 1000));
    expect(session.creator).to.equal(owner.address);
  });

  it("should allow voting on a valid session", async function () {
    const question = "What is your favorite color?";
    const options = ["Red", "Blue", "Green"];
    const duration = 3600;

    await voting.createSession(question, options, duration);

    await voting.connect(addr1).castVote(0, 1);

    const hasVoted = await voting.getSessionDetails(0);
    expect(hasVoted[0]).to.equal(question);
  });

  it("should not allow double voting", async function () {
    const question = "What is your favorite color?";
    const options = ["Red", "Blue", "Green"];
    const duration = 3600;

    await voting.createSession(question, options, duration);

    await voting.connect(addr1).castVote(0, 1);
    await expect(voting.connect(addr1).castVote(0, 1)).to.be.revertedWith("Already voted");
  });

  it("should close the session after the duration ends", async function () {
    const question = "What is your favorite color?";
    const options = ["Red", "Blue", "Green"];
    const duration = 1;

    await voting.createSession(question, options, duration);
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);

    await expect(voting.closeSession(0)).to.not.be.reverted;
  });

  it("should not allow voting after session is closed", async function () {
    const question = "What is your favorite color?";
    const options = ["Red", "Blue", "Green"];
    const duration = 1;

    await voting.createSession(question, options, duration);
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);
    await voting.closeSession(0);

    await expect(voting.connect(addr1).castVote(0, 1)).to.be.revertedWith("Voting closed");
  });

  it("should return the correct results", async function () {
    const question = "What is your favorite color?";
    const options = ["Red", "Blue", "Green"];
    const duration = 3600;

    await voting.createSession(question, options, duration);
    await voting.connect(addr1).castVote(0, 1);
    await voting.connect(addr2).castVote(0, 2);

    const [optionTexts, votes] = await voting.getSessionResults(0);

    expect(optionTexts[0]).to.equal("Red");
    expect(optionTexts[1]).to.equal("Blue");
    expect(optionTexts[2]).to.equal("Green");

    expect(Number(votes[0])).to.equal(0);
    expect(Number(votes[1])).to.equal(1);
    expect(Number(votes[2])).to.equal(1);
  });
});
