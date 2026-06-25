import { registerCommand } from "../../CommandRegistry.js"  
import { system, world } from "@minecraft/server"
import { logReply } from "../../../utilities/LogReply.js"
import { config } from "../../../config.js"
import * as db from "../../../utilities/DatabaseHandler.js"

const commandInformation = {
  name: "suicide",
  description: "Cause yourself to die instantly.",
  usage: []
}


if(config.overridePackSetting ? config.commands.allowCommands.suicide : world.getPackSettings()["essentialcc:suicide"]) {
  const cooldowns = new Map()
  registerCommand(commandInformation, (origin) => {
    const executor = origin?.sourceEntity
    const setting = db.fetch("essentialcc:setting")

    if(executor?.typeId !== "minecraft:player") return console.log("Only a player can run this command")

    // Cooldowns
    const cooldown = cooldowns.get(executor.id)
    if(cooldown?.tick >= system.currentTick) {
      return executor.sendMessage(`§cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
    } else {
      cooldowns.set(executor.id, {tick: system.currentTick + (config.overridePackSetting ? config.commands.cooldown : world.getPackSettings()["essentialcc:commands_cooldown"])*20})
    }
    executor.sendMessage("§eYou just killed yourself.")
    system.run(() => executor.kill())
  })
}
