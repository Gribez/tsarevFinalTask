import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployVotingContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Voting", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployVotingContract;
deployVotingContract.tags = ["Voting"];
