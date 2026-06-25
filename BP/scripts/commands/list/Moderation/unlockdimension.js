import { registerCommand } from "../../CommandRegistry.js"  
import * as db from "../../../utilities/DatabaseHandler.js"
import { logReply } from "../../../utilities/LogReply.js"
import { config } from "../../../config.js"
import { world } from "@minecraft/server"

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
    const executor = origin?.sourceEntity
    let lockedDimensions = db.fetch("essentialcc:lockedDimensions", true)
    const dimension = world.getDimension(target)
    if(!dimension) return logReply(executor, `§c${target} dimension doesn't exists`)

    if(!lockedDimensions.some(d => d.dimension === target)) return logReply(executor, `§cThis dimension was not locked`)
    lockedDimensions = lockedDimensions.filter(d => d.dimension !== target)
    db.store("essentialcc:lockedDimensions", lockedDimensions)
    logReply(executor, `§eYou have succesfully unlocked ${target}`)
  })
}
