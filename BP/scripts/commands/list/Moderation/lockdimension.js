import registerCommand from "../../CommandRegistry.js"  
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"
import { world, CustomCommandStatus } from "@minecraft/server"  
import ParseDuration from "../../../utilities/ParseDuration.js"

const commandInformation = {
  name: "lockdimension",
  description: "Lock a dimension to prevent players teleporting in this dimension.",
  permissionLevel: 1,
  aliases: [],
  usage: [
    {
      name: "dimension",
      type: "String",
      optional: false
    },
    {
      name: "duration",
      type: "String",
      optional: true
    }
  ]
}

// Next Update: Duration
if(config.overridePackSetting ? config.commands.allowCommands.lockdimension : world.getPackSettings()["essentialcc:lockdimension"]) {
  registerCommand(commandInformation, (origin, target, duration) => {
    const lockedDimensions = Database.fetch("essentialcc:lockedDimensions", true)
    const dimension = world.getDimension(target)

    if(!dimension)
      return {
        status: CustomCommandStatus.Failure,
        message: `${target} dimension doesn't exists`
      }
    if(lockedDimensions.some(d => d.dimension === dimension.id))
      return {
        status: CustomCommandStatus.Failure,
        message: `${target} dimension is already locked`
      }
    

    if(duration) {
      var parsedDuration = ParseDuration(duration)
      if(isNaN(parsedDuration)) 
        return {
          status: CustomCommandStatus.Failure,
          message: parsedDuration
        } 
    }
    
    lockedDimensions.push({dimension: dimension.id, duration: parsedDuration})
    Database.store("essentialcc:lockedDimensions", lockedDimensions)
    return {
      status: CustomCommandStatus.Success,
      message: `You have succesfully locked ${target} from players.`
    }
  })
}
