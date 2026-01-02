import { registerCommand } from "../CommandRegistry.js"  
import * as db from "../../utilities/DatabaseHandler.js"
import { logReply } from "../../utilities/LogReply.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "lockdimension",
  description: "Lock a dimension to prevent players teleporting in this dimension.",
  permissionLevel: 1,
  aliases: [],
  usage: [
    {
      name: "essentialcc:dimension",
      type: "Enum",
      optional: false
    }
  ]
}

// Next Update: Duration
if(config.commands.allowCommands.lockdimension) {
  registerCommand(commandInformation, (origin, target, duration) => {

    const executor = origin?.sourceEntity
    const lockedDimensions = db.fetch("essentialcc:lockedDimensions", true)
    if(!["minecraft:nether", "minecraft:the_end"].includes(target)) return logReply(executor, `§c${target} dimension doesn't exists`)

    lockedDimensions.push({dimension: target, duration: duration})
    db.store("essentialcc:lockedDimensions", lockedDimensions)
    logReply(executor, `§eYou have succesfully locked ${target} from players`)
  })
}
