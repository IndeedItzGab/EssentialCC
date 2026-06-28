import registerCommand from "../../CommandRegistry.js"  
import { world, system, CustomCommandStatus } from "@minecraft/server"
import config from "../../../config.js"

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

if(config.overridePackSetting ? config.commands.allowCommands.kickall : world.getPackSettings()["essentialcc:kickall"]) {
  registerCommand(commandInformation, (origin, reason = "No reason provided.", includeOperators) => {
    for(const player of world.getPlayers()) {
      if((!includeOperators && player.playerPermissionLevel === 2) || player.id === origin?.sourceEntity?.id) continue;
      system.run(() => player.runCommand(`kick @s ${reason}`))
    }

    return {
      status: CustomCommandStatus.Success,
      message: "You have kicked all players in the world"
    }
  })
}