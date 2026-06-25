import { registerCommand } from "../../CommandRegistry.js"  
import * as db from "../../../utilities/DatabaseHandler.js"
import { config } from "../../../config.js"
import { system, world } from "@minecraft/server"

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


if(config.overridePackSetting ? config.commands.allowCommands.setwarp : world.getPackSettings()["essentialcc:setwarp"]) {
  const cooldowns = new Map()
  registerCommand(commandInformation, (origin, name) => {
    const executor = origin?.sourceEntity
    const setting = db.fetch("essentialcc:setting")

    // Return if the command was not a player
    if(executor?.typeId !== "minecraft:player") return console.log("You should be a player to run this command.")

    // Cooldowns
    const cooldown = cooldowns.get(executor.id)
    if(cooldown?.tick >= system.currentTick) {
      return executor.sendMessage(`§cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
    } else {
      cooldowns.set(executor.id, {tick: system.currentTick + (config.overridePackSetting ? config.commands.cooldown : world.getPackSettings()["essentialcc:commands_cooldown"])*20})
    }

    let warps = db.fetch("essentialcc:warps", true)
    if(warps.filter(d => d.player === executor.id).length >= (config.overridePackSetting ? config.commands.settings.warp.max : world.getPackSettings()["essentialcc:max_warps"])) return executor.sendMessage(`§cYou have already reached the maximum warps count!`)
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
