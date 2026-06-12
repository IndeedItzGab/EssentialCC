import { registerCommand } from "../../CommandRegistry.js"  
import { world, system } from "@minecraft/server"
import { logReply } from "../../../utilities/LogReply.js"
import { config } from "../../../config.js"

const commandInformation = {
  name: "burn",
  description: "Set a player on fire in a seconds",
  permissionLevel: 1,
  aliases: [],
  usage: [
    {
      name: "target",
      type: "PlayerSelector",
      optional: false,
    },
    {
      name: "seconds",
      type: "Integer",
      optional: false
    }
  ]
}

if(config.commands.allowCommands.burn) {
  registerCommand(commandInformation, (origin, target, seconds) => {
    const executor = origin?.sourceEntity
    if(target.length === 0) return logReply(executor, "§cCould not find that player")

    // For @a
    let players = []
    for(const p of target) {
      const player = world.getPlayers().find(player => player.id === p.id)
      players.push(player)

      system.run(() => player.setOnFire(seconds))
    }

    players.length > 1 ? logReply(executor, `§eEveryone is now burning!`) : logReply(executor, `§e${players[0].name} is now burning!`)
  })
}
