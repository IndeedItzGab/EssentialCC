import registerCommand from "../../CommandRegistry.js"  
import { world, system, CustomCommandStatus } from "@minecraft/server"
import config from "../../../config.js"

const commandInformation = {
  name: "nickname",
  description: "Set a new nickname to a specifc player(s).",
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

if(config.overridePackSetting ? config.commands.allowCommands.nickname : world.getPackSettings()["essentialcc:nickname"]) {
  registerCommand(commandInformation, (origin, target, nickname) => {
    if(target.length === 0) {
      return {
        status: CustomCommandStatus.Failure,
        message: "Could not find that player"
      }
    }
    
    // For @a
    let players = []
    for(const p of target) {
      const player = world.getPlayers().find(player => player.id === p.id)
      players.push(player)
      system.run(() => player.nameTag = nickname);
    }

    return {
      status: CustomCommandStatus.Success,
      message: players.length > 1
        ? "You have successfully changed everyone's nickname"
        : `You have successfully changed ${players[0].name}'s nickname`
    }
  })
}
