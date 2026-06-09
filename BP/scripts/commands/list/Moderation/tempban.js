import { registerCommand } from "../../CommandRegistry.js"  
import { world, system } from "@minecraft/server"
import * as db from "../../../utilities/DatabaseHandler.js"
import { logReply } from "../../../utilities/LogReply.js"
import { config } from "../../../config.js"
import { ParseDuration } from "../../../utilities/ParseDuration.js"

const commandInformation = {
  name: "tempban",
  description: "Temporarily ban a player from the server.",
  permissionLevel: 1,
  aliases: [],
  usage: [
    {
      name: "player",
      type: "PlayerSelector", // Supports @a, @s, @r, and @p
      optional: false,
    },
    {
      name: "duration",
      type: "String",
      optional: false
    },
    {
      name: "reason",
      type: "String",
      optional: true
    }
  ]
}

if(config.commands.allowCommands.tempban) {
  registerCommand(commandInformation, (origin, target, duration, reason) => {
    const executor = origin?.sourceEntity
    if(target.length === 0) return logReply(executor, "§cCould not find that player")
    
    let bannedPlayers = db.fetch("essentialcc:bannedPlayers", true);


    if(duration) {
      var parsedDuration = ParseDuration(duration)
      if(isNaN(parsedDuration)) {
        return logReply(executor, parsedDuration);
      }
    }

    // For @a
    let players = []
    for(const p of target) {
      const player = world.getPlayers().find(player => player.id === p.id)
      system.run(() => player.runCommand(`kick @s ${reason || ''}`))
      players.push(player)

      if(bannedPlayers.some(p => p.name == player.name)) return;
      bannedPlayers.push({name: player.name, reason: reason, duration: parsedDuration})
    }


    db.store("essentialcc:bannedPlayers", bannedPlayers)
    const finalizeReason = reason ? `: ${reason}` : '';
    players.length > 1 ? logReply(executor, "§eBTemporarily banned everyone from the game" + finalizeReason) : logReply(executor, `§eTemporarily banned ${players[0].name} from the game` + finalizeReason);
  })
}