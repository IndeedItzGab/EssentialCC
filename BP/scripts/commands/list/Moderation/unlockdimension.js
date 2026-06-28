import registerCommand from "../../CommandRegistry.js"  
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"
import { world, CustomCommandStatus } from "@minecraft/server"

const commandInformation = {
  name: "unlockdimension",
  description: "Unlock a dimension to let players teleport to this dimension.",
  permissionLevel: 1,
  aliases: [],
  usage: [
    {
      name: "dimension",
      type: "String",
      optional: false
    }
  ]
}

if(config.overridePackSetting ? config.commands.allowCommands.unlockdimension :  world.getPackSettings()["essentialcc:unlockdimension"]) {
  registerCommand(commandInformation, (origin, target) => {
    let lockedDimensions = Database.fetch("essentialcc:lockedDimensions", true)
    const dimension = world.getDimension(target)
    if(!dimension) 
      return {
        status: CustomCommandStatus.Failure,
        message: `${target} dimension doesn't exists`
      }
    if(!lockedDimensions.some(d => d.dimension === target))
      return {
        status: CustomCommandStatus.Failure,
        message: `${target} dimension was not locked`
      }

    lockedDimensions = lockedDimensions.filter(d => d.dimension !== target)
    Database.store("essentialcc:lockedDimensions", lockedDimensions)

    return {
      status: CustomCommandStatus.Success,
      message: `You have succesfully unlocked ${target}`
    }
  })
}
