import { registerCommand } from "../../CommandRegistry.js"  
import * as db from "../../../utilities/DatabaseHandler.js"
import { config } from "../../../config.js"
import { system } from "@minecraft/server"

const commandInformation = {
  name: "setwarp",
  description: "Set a warp location with your current location.",
  aliases: [],
  usage: [
    {
      name: "name",
      type: "String",
      optional: false
    }
  ]
}

let cooldowns = new Map()
if(config.commands.allowCommands.setwarp) {
  registerCommand(commandInformation, (origin, name) => {
    const executor = origin?.sourceEntity
    const setting = db.fetch("essentialcc:setting")

    // Return if the command was not a player
    if(executor?.typeId !== "minecraft:player") return console.log("You should be a player to run this command.")

    // Cooldowns
    const cooldown = cooldowns.get(player.id)
    if(cooldown?.tick >= system.currentTick) {
      return player.sendMessage(`$cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
    } else {
      cooldowns.set(player.id, {tick: system.currentTick + config.commands.cooldown*20})
    }

    let warps = db.fetch("essentialcc:warps", true)
    if(warps.filter(d => d.player === executor.id).length >= config.commands.settings.warp.max) return executor.sendMessage(`§cYou have already reached the maximum warps count!`)
    if(warps.some(d => (d.player === executor.id && d.name === name))) return executor.sendMessage(`§cThat warp's name already exists!`)
      
    warps.push({
      name: name,
      player: executor.id,
      dimension: executor.dimension.id,
      location: {
        x: executor.location.x,
        y: executor.location.y,
        z: executor.location.z
      }
    })

    db.store("essentialcc:warps", warps)
    executor.sendMessage(`§aYou have set a warp in your current location.`)
  })
}
