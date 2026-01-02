import { registerCommand } from "../CommandRegistry"  
import { world, system } from "@minecraft/server"
import { logReply } from "../../utilities/LogReply.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "nickname",
  description: "Set a new nickname to a specifc player(s)",
  permissionLevel: 1,
  aliases: ["nick"],
  usage: [
    {
      name: "player",
      type: "PlayerSelector", // Supports @a, @s, @r, and @p
      optional: false,
    },
    {
      name: "nickname",
      type: "String",
      optional: true
    }
  ]
}

if(config.commands.allowCommands.nickname) {
  registerCommand(commandInformation, (origin, target, nickname) => {
    const executor = origin?.sourceEntity
    if(target.length === 0) return logReply(executor, "§cCould not find that player")
    
    // For @a
    let players = []
    for(const p of target) {
      const player = world.getPlayers().find(player => player.id === p.id)
      players.push(player)
      system.run(() => player.nameTag = nickname);
    }

    players.length > 1 ? logReply(executor, `§eYou have successfully changed everyone's nickname`) : logReply(executor, `§eYou have successfully changed ${players[0].name}'s nickname`)
  })
}
