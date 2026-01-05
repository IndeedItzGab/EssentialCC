import { registerCommand } from "../CommandRegistry"  
import { world } from "@minecraft/server"
import { logReply } from "../../utilities/LogReply.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "realname",
  description: "Show the real gamertag of the specified nickname.",
  permissionLevel: 1,
  usage: [
    {
      name: "nickname",
      type: "String",
      optional: false,
    }
  ]
}

if(config.commands.allowCommands.realname) {
  registerCommand(commandInformation, (origin, nickname) => {
    const executor = origin?.sourceEntity
    let players = []
    for(const player of world.getPlayers()) {
      if(player.nameTag === nickname) {
        players.push(player.name)
      }
    }

    logReply(executor, `§ePlayers: ${players.join(", ")}`)
  })
}
