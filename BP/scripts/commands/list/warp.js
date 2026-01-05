import { registerCommand } from "../CommandRegistry"  
import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "warp",
  description: "Teleport to the location of the specified warp",
  aliases: [],
  usage: [
    {
      name: "name",
      type: "String",
      optional: false
    }
  ]
}

if(config.commands.allowCommands.warp) {
  registerCommand(commandInformation, (origin, name) => {
    const executor = origin?.sourceEntity

    // Return if the command was not a player
    if(executor?.typeId !== "minecraft:player") return console.log("You should be a player to run this command.")

    const warp = db.fetch("essentialcc:warps", true).find(w => (w.player === executor.id && w.name === name))
    if(db.fetch("essentialcc:combatData", true).find(d => d.name === executor.name)?.time >= system.currentTick) return executor.sendMessage("§cYou can't use this command while in combat with other player.")
    if(!warp) return executor.sendMessage("§cThat warp does not exists")
    
    executor.sendMessage(`§eYou will be teleported in 5 seconds, don't move.`)
    system.run(() => executor.addTag("essentialcc:isTp"))
    system.runTimeout(() => {
      if(!executor.hasTag("essentialcc:isTp")) return;
      const dimension = world.getDimension(warp.dimension)
      executor.tryTeleport({x: warp.location.x, y: warp.location.y, z: warp.location.z}, {dimension: dimension})
      executor.sendMessage(`§aYou have been teleported to your warp.`)
      system.run(() => executor.removeTag("essentialcc:isTp"))
    },5*20)
  })
}
