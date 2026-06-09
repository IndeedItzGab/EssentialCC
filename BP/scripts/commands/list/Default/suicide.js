import { registerCommand } from "../../CommandRegistry.js"  
import { system } from "@minecraft/server"
import { logReply } from "../../../utilities/LogReply.js"
import { config } from "../../../config.js"
import * as db from "../../../utilities/DatabaseHandler.js"

const commandInformation = {
  name: "suicide",
  description: "Cause yourself to die instantly",
  usage: []
}

let cooldowns = new Map()
if(config.commands.allowCommands.suicide) {
  registerCommand(commandInformation, (origin) => {
    const executor = origin?.sourceEntity
    const setting = db.fetch("essentialcc:setting")

    if(executor?.typeId !== "minecraft:player") return console.log("Only a player can run this command")

    // Cooldowns
    const cooldown = cooldowns.get(player.id)
    if(cooldown?.tick >= system.currentTick) {
      return player.sendMessage(`$cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
    } else {
      cooldowns.set(player.id, {tick: system.currentTick + config.commands.cooldown*20})
    }
    executor.sendMessage("§eYou just killed yourself.")
    system.run(() => executor.kill())
  })
}
