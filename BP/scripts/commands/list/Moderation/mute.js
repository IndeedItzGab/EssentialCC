import { registerCommand } from "../../CommandRegistry.js"  
import { world, system } from "@minecraft/server"
import * as db from "../../../utilities/DatabaseHandler.js"
import { logReply } from "../../../utilities/LogReply.js"
import { config } from "../../../config.js"
import { ParseDuration } from "../../../utilities/ParseDuration.js"

const commandInformation = {
  name: "mute",
  description: "Mute a player from chatting in the game.",
  permissionLevel: 1,
  aliases: [],
  usage: [
    {
      name: "player",
      type: "PlayerSelector", // Supports @a, @s, @r, and @p
      optional: false,
    },
    {
      name: "reason",
      type: "String",
      optional: true
    },
    {
      name: "duration",
      type: "String",
      optional: true
    }
  ]
}

if(config.commands.allowCommands.mute) {
  registerCommand(commandInformation, (origin, target, reason, duration) => {
    const executor = origin?.sourceEntity
    if(target.length === 0) return logReply(executor, "§cCould not find that player")
    
    let mutedPlayers = db.fetch("essentialcc:mutedPlayers", true);

    if(duration) {
      var parsedDuration = ParseDuration(duration)
      if(isNaN(parsedDuration)) {
        return logReply(executor, parsedDuration)
      }
    }
  
    // For @a
    let players = []
    for(const p of target) {
      const player = world.getPlayers().find(player => player.id === p.id)
      players.push(player)

      player.sendMessage("§cYou have been muted by an Operator")
      mutedPlayers = mutedPlayers.filter(p => p.name !== player.name) // Overriding thing
      mutedPlayers.push({name: player.name, reason: reason, duration: parsedDuration})
    }


    db.store("essentialcc:mutedPlayers", mutedPlayers)

    const finalizeReason = reason ? `: ${reason}` : '';
    players.length > 1 ? logReply(executor, "Muted everyone from the game" + finalizeReason) : logReply(executor, `Muted ${players[0].name} from the game` + finalizeReason);
  })
}