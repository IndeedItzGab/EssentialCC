import { registerCommand } from "../../CommandRegistry.js"  
import * as db from "../../../utilities/DatabaseHandler.js"
import { logReply } from "../../../utilities/LogReply.js"
import { config } from "../../../config.js"
import { world } from "@minecraft/server"  
import { ParseDuration } from "../../../utilities/ParseDuration.js"

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
if(config.commands.allowCommands.lockdimension) {
  registerCommand(commandInformation, (origin, target, duration) => {

    const executor = origin?.sourceEntity
    const lockedDimensions = db.fetch("essentialcc:lockedDimensions", true)
    const dimension = world.getDimension(target)
    if(!dimension) return logReply(executor, `§c${target} dimension doesn't exists`)
    if(lockedDimensions.some(d => d.dimension === dimension.id)) return logReply(executor, `§c${target} dimension is already locked`)

    if(duration) {
      var parsedDuration = ParseDuration(duration)
      if(isNaN(parsedDuration)) {
        return logReply(executor, parsedDuration);
      }
    }
    
    lockedDimensions.push({dimension: dimension.id, duration: parsedDuration})
    db.store("essentialcc:lockedDimensions", lockedDimensions)
    logReply(executor, `§eYou have succesfully locked ${target} from players.`)
  })
}
