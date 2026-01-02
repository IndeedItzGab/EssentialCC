import { registerCommand } from "../CommandRegistry"  
import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "home",
  description: "Teleport to the location of your home",
  aliases: [],
  usage: []
}

if(config.commands.allowCommands.home) {
  registerCommand(commandInformation, (origin) => {
    const executor = origin?.sourceEntity

    // Return if the command was not a player
    if(executor?.typeId !== "minecraft:player") return console.log("You should be a player to run this command.")

    const home = db.fetch("essentialcc:homes", true).find(h => h.player === executor.name)
    if(db.fetch("essentialcc:combatData", true).find(d => d.name === executor.name)?.time >= system.currentTick) return executor.sendMessage("§cYou can't use this command while in combat with other player.")
    if(!home) return executor.sendMessage("§cYou do not have home location")
    
    executor.sendMessage(`§eYou will be teleported in 5 seconds, don't move.`)
    system.run(() => executor.addTag("essentialcc:isTp"))
    system.runTimeout(() => {
      if(!executor.hasTag("essentialcc:isTp")) return;
      const dimension = world.getDimension(home.dimension)
      executor.tryTeleport({x: home.location.x, y: home.location.y, z: home.location.z}, {dimension: dimension})
      executor.sendMessage(`§aYou have been teleported to your home.`)
      system.run(() => executor.removeTag("essentialcc:isTp"))
    },5*20)
  })
}
