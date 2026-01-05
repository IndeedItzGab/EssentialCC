import { registerCommand } from "../CommandRegistry"  
import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"
import { logReply } from "../../utilities/LogReply.js"
import { config } from "../../config.js"

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
  
    // For @a
    let players = []
    for(const p of target) {
      const player = world.getPlayers().find(player => player.id === p.id)
      let parsedDuration;
      players.push(player)

      if(mutedPlayers.some(p => p.name == player.name)) return executor.sendMessage("real");
      // Duration parser
      if(duration.endsWith('s')) {
        // Seconds
        parsedDuration = system.currentTick + (parseInt(duration.replaceAll("s", '')) * 20)
        if(parsedDuration < system.currentTick + (60*20)) return logReply(executor, "§cDuration must be at least a minute.")
      } else if(duration.endsWith('m')) {
        // Minutes
        parsedDuration = system.currentTick + (parseInt(duration.replaceAll("s", '')) * 60 * 20)
      } else if(duration.endsWith('h')) {
        // Hours
        parsedDuration = system.currentTick + (parseInt(duration.replaceAll("s", '')) * 60 * 60* 20)
      } else if(duration.endsWith('d')) {
        // Days
        parsedDuration = system.currentTick + (parseInt(duration.replaceAll("s", '')) * 60 * 60 * 24 * 20)
      } else if(duration) {
        return logReply(executor, "§cDuration parameter must be 60s, 1m, 1h, or 1d in example.")
      }
      player.sendMessage("§cYou have been muted by an Operator")
      mutedPlayers.push({name: player.name, reason: reason, duration: parsedDuration})
    }


    db.store("essentialcc:mutedPlayers", mutedPlayers)

    const finalizeReason = reason ? `: ${reason}` : '';
    players.length > 1 ? logReply(executor, "Muted everyone from the game" + finalizeReason) : logReply(executor, `Muted ${players[0].name} from the game` + finalizeReason);
  })
}