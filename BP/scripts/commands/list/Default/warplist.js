import { registerCommand } from "../../CommandRegistry.js"  
import * as db from "../../../utilities/DatabaseHandler.js"
import { config } from "../../../config.js"
import { system, world } from "@minecraft/server"

const commandInformation = {
  name: "warplist",
  description: "List all warps available.",
  aliases: [],
  usage: []
}


if(config.overridePackSetting ? config.commands.allowCommands.warplist : world.getPackSettings()["essentialcc:warplist"]) {
  const cooldowns = new Map()
  registerCommand(commandInformation, (origin) => {
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

    let warps = db.fetch("essentialcc:warps", true).filter(w => w.player === executor.id)

    executor.sendMessage(`§eWarp(s) list: ${warps.map(w => w.name).join(', ')}`)
  })
}
