import { registerCommand } from "../CommandRegistry"  
import * as db from "../../utilities/DatabaseHandler.js"
import { logReply } from "../../utilities/LogReply.js"
import { config } from "../../config.js"

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

if(config.commands.allowCommands.pardon) {
  registerCommand(commandInformation, (origin, target) => {
    const executor = origin?.sourceEntity
    let bannedPlayers = db.fetch("essentialcc:bannedPlayers", true);

    if(bannedPlayers.some(p => p.name === target)) {
      bannedPlayers = bannedPlayers.filter(p => p.name !== target)
      db.store("essentialcc:bannedPlayers", bannedPlayers)
      logReply(executor, `§eYou have pardoned ${target} from the server`)
    } else {
      logReply(executor, `§cThat player was not banned from the server`)
    }
})
}
