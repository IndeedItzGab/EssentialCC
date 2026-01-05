import { registerCommand } from "../CommandRegistry"  
import { world, system } from "@minecraft/server"
import { logReply } from "../../utilities/LogReply.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "kickall",
  description: "Kick all players within the game except the issuer.",
  permissionLevel: 1,
  aliases: [],
  usage: [
    {
      name: "reason",
      type: "String",
      optional: true,
    },
    {
      name: "includeOperators",
      type: "Boolean",
      optional: true,
    }
  ]
}

if(config.commands.allowCommands.kickall) {
  registerCommand(commandInformation, (origin, reason, includeOperators) => {
    const executor = origin?.sourceEntity
    for(const player of world.getPlayers()) {
      if((!includeOperators && player.playerPermissionLevel === 2) || player.id === executor?.id) continue;
      system.run(() => player.runCommand(`kick @s ${reason ? reason : 'No reason was given'}`))
    }

    logReply(executor, "§eYou have kicked all players in the world")
  })
}