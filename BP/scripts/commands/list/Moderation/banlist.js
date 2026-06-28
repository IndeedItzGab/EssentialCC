import { world, CustomCommandStatus } from "@minecraft/server"
import registerCommand from "../../CommandRegistry.js"  
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"


const commandInformation = {
  name: "banlist",
  description: "List all the names of banned players.",
  permissionLevel: 1,
  aliases: [],
  usage: []
}

if(config.overridePackSetting ? config.commands.allowCommands.banlist : world.getPackSettings()["essentialcc:banlist"]) {
  registerCommand(commandInformation, (origin) => {
    const bannedPlayers = Database.fetch("essentialcc:bannedPlayers", true)
    return {
      status: CustomCommandStatus.Success,
      message: `§eBanned Players: ${bannedPlayers.map(p => p.name).join(", ")}`
    }
  })
}
