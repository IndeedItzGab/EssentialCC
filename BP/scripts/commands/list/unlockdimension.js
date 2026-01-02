import { registerCommand } from "../CommandRegistry.js"  
import * as db from "../../utilities/DatabaseHandler.js"
import { logReply } from "../../utilities/LogReply.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "unlockdimension",
  description: "Unlock a dimension to let players teleport to this dimension.",
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

if(config.commands.allowCommands.unlockdimension) {
  registerCommand(commandInformation, (origin, target) => {
    const executor = origin?.sourceEntity
    let lockedDimensions = db.fetch("essentialcc:lockedDimensions", true)
    if(!["minecraft:nether", "minecraft:the_end"].includes(target)) return logReply(executor, `§c${target} dimension doesn't exists`)

    if(!lockedDimensions.some(d => d.dimension === target)) return logReply(executor, `§cThis dimension was not locked`)
    lockedDimensions = lockedDimensions.filter(d => d.dimension !== target)
    db.store("essentialcc:lockedDimensions", lockedDimensions)
    logReply(executor, `§eYou have succesfully unlocked ${target}`)
  })
}
