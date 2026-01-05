import { registerCommand } from "../CommandRegistry"  
import { world } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"
import { logReply } from "../../utilities/LogReply.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "unmute",
  description: "Unmute the player from sending chats in the game.",
  permissionLevel: 1,
  usage: [
    {
      name: "player",
      type: "String",
      optional: false,
    }
  ]
}

if(config.commands.allowCommands.unmute) {
  registerCommand(commandInformation, (origin, target) => {
    const executor = origin?.sourceEntity
    let mutedPlayers = db.fetch("essentialcc:mutedPlayers", true);

    if(mutedPlayers.some(p => p.name === target)) {
      mutedPlayers = mutedPlayers.filter(p => p.name !== target)
      db.store("essentialcc:mutedPlayers", mutedPlayers)
      world.getPlayers().find(p => p.name === target).sendMessage(`§eYou have been unmuted by an Operator`)
      logReply(executor, `§eYou have unmuted ${target} from the server`)
    } else {
      logReply(executor, `§cThat player was not muted from the server`)
    }
})
}
