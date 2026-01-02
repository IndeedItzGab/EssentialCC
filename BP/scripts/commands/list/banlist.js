import { registerCommand } from "../CommandRegistry"  
import * as db from "../../utilities/DatabaseHandler.js"
import { logReply } from "../../utilities/LogReply.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "banlist",
  description: "List all the names of banned players.",
  permissionLevel: 1,
  aliases: [],
  usage: []
}

if(config.commands.allowCommands.banlist) {
  registerCommand(commandInformation, (origin, target, reason) => {
    const bannedPlayers = db.fetch("essentialcc:bannedPlayers", true)
    logReply(origin.sourceEntity, `§eBanned Players: ${bannedPlayers.map(p => p.name).join(", ")}`)
  })
}
