import { registerCommand } from "../../CommandRegistry.js"  
import * as db from "../../../utilities/DatabaseHandler.js"
import { config } from "../../../config.js"
import { system } from "@minecraft/server" 

const commandInformation = {
  name: "delwarp",
  description: "Delete the specified warp",
  aliases: [],
  usage: [
    {
      name: "name",
      type: "String",
      optional: false
    }
  ]
}

const cooldowns = new Map()
if(config.commands.allowCommands.delwarp) {
  registerCommand(commandInformation, (origin, name) => {
    const executor = origin?.sourceEntity
    const setting = db.fetch("essentialcc:setting")

    // Return if the command was not a player
    if(executor?.typeId !== "minecraft:player") return console.log("You should be a player to run this command.")
    
    // Cooldown
    const cooldown = cooldowns.get(player.id)
    if(cooldown?.tick >= system.currentTick) {
      return player.sendMessage(`$cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
    } else {
      cooldowns.set(player.id, {tick: system.currentTick + config.commands.cooldown*20})
    }

    let warps = db.fetch("essentialcc:warps", true)
    if(!warps.some(d => d.player === executor.id && d.name === name)) return executor.sendMessage(`§cThat warp does not exist!`)
      
    warps = warps.filter(d => !(d.player === executor.id && d.name === name))

    db.store("essentialcc:warps", warps)
    executor.sendMessage(`§aYou just deleted "${name}" warp`)
  })
}
