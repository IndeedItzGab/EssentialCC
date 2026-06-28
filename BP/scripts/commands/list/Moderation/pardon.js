import registerCommand from "../../CommandRegistry.js"  
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"
import { world, CustomCommandStatus } from "@minecraft/server"

const commandInformation = {
  name: "pardon",
  description: "Pardon a player that was banned from the server.",
  permissionLevel: 1,
  aliases: ["unban"],
  usage: [
    {
      name: "player",
      type: "String",
      optional: false,
    }
  ]
}

if(config.overridePackSetting ? config.commands.allowCommands.pardon : world.getPackSettings()["essentialcc:pardon"]) {
  registerCommand(commandInformation, (origin, target) => {
    let bannedPlayers = Database.fetch("essentialcc:bannedPlayers", true);

    if(bannedPlayers.some(p => p.name === target)) {
      Database.store("essentialcc:bannedPlayers", bannedPlayers.filter(p => p.name !== target))
      return {
        status: CustomCommandStatus.Success,
        message: `You have pardoned ${target} from the server`
      }
    } else {
      return {
        status: CustomCommandStatus.Failure,
        message: "That player was not banned from the server"
      }
    }
})
}
