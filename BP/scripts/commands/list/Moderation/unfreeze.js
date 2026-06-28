import registerCommand from "../../CommandRegistry.js"  
import { world, CustomCommandStatus, InputPermissionCategory, system } from "@minecraft/server"
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"

const commandInformation = {
  name: "unfreeze",
  description: "Unfreeze the player from being unable to move or turn around.",
  permissionLevel: 1,
  usage: [
    {
      name: "player",
      type: "String",
      optional: false,
    }
  ]
}

if(config.overridePackSetting ? config.commands.allowCommands.unfreeze : world.getPackSettings()["essentialcc:unfreeze"]) {
  registerCommand(commandInformation, (origin, target) => {
    let freezePlayers = Database.fetch("essentialcc:freezePlayers", true);

    if(freezePlayers.some(p => p.name === target)) {
      freezePlayers = freezePlayers.filter(p => p.name !== target)
      Database.store("essentialcc:freezePlayers", freezePlayers)

      const player = world.getPlayers().find(p => p.name === target)
      system.run(() => {
        player?.inputPermissions?.setPermissionCategory(InputPermissionCategory.Camera, true)
        player?.inputPermissions?.setPermissionCategory(InputPermissionCategory.Movement, true)
      })
      
      player?.sendMessage(`§eYou have been unfreezed by an Operator`)
      return {
        status: CustomCommandStatus.Success,
        message: `You have unfreezed ${target} in the world`
      }
    } else {
      return {
        status: CustomCommandStatus.Failure,
        message: "That player was not freezing in the world"
      }
    }
  })
}
