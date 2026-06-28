import { world, system, CustomCommandStatus } from "@minecraft/server"
import registerCommand from "../../CommandRegistry.js"  
import config from "../../../config.js"

const commandInformation = {
  name: "burn",
  description: "Set a player on fire in a seconds.",
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

if(config.overridePackSetting ? config.commands.allowCommands.burn : world.getPackSettings()["essentialcc:burn"]) {
  registerCommand(commandInformation, (origin, target, seconds) => {
    if(target.length === 0) 
      return {
        status: CustomCommandStatus.Failure,
        message: "Could not find that player"
      }

    // For @a
    let players = []
    for(const p of target) {
      const player = world.getPlayers().find(player => player.id === p.id)
      players.push(player)

      system.run(() => player.setOnFire(seconds))
    }

    return {
      status: CustomCommandStatus.Success,
      message: players.length > 1
        ?  `Everyone is now burning!`
        : `${players[0].name} is now burning!`
    }
  })
}
