import registerCommand from "../../CommandRegistry.js"  
import { world, CustomCommandStatus} from "@minecraft/server"
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"

const commandInformation = {
  name: "unmute",
  description: "Unmute the player from sending chats in the game.",
  permissionLevel: 1,
  usage: [
    {
      name: "player",
      type: "String",
      optional: false,
    }
  ]
}

if(config.overridePackSetting ? config.commands.allowCommands.unmute : world.getPackSettings()["essentialcc:unmute"]) {
  registerCommand(commandInformation, (origin, target) => {
    let mutedPlayers = Database.fetch("essentialcc:mutedPlayers", true);

    if(mutedPlayers.some(p => p.name === target)) {
      mutedPlayers = mutedPlayers.filter(p => p.name !== target)
      Database.store("essentialcc:mutedPlayers", mutedPlayers)
      world.getPlayers().find(p => p.name === target).sendMessage(`§eYou have been unmuted by an Operator`)
      return {
        status: CustomCommandStatus.Success,
        message: `You have unmuted ${target} from the server`
      }
    } else {
      return {
        status: CustomCommandStatus.Failure,
        message: "That player was not muted from the server"
      }
    }
  })
}
