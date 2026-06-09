import { registerCommand } from "../../CommandRegistry.js"  
import * as db from "../../../utilities/DatabaseHandler.js"
import { config } from "../../../config.js"
import { system } from "@minecraft/server"

const commandInformation = {
  name: "warplist",
  description: "List all warps available.",
  aliases: [],
  usage: []
}

let cooldowns = new Map()
if(config.commands.allowCommands.warplist) {
  registerCommand(commandInformation, (origin) => {
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

    let warps = db.fetch("essentialcc:warps", true).filter(w => w.player === executor.id)

    executor.sendMessage(`§eWarp(s) list: ${warps.map(w => w.name).join(', ')}`)
  })
}
