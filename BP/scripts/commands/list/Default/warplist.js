import registerCommand from "../../CommandRegistry.js"  
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"
import { system, world, CustomCommandStatus } from "@minecraft/server"

const commandInformation = {
  name: "warplist",
  description: "List all warps available.",
  aliases: [],
  usage: []
}


if(config.overridePackSetting ? config.commands.allowCommands.warplist : world.getPackSettings()["essentialcc:warplist"]) {
  const cooldowns = new Map()
  registerCommand(commandInformation, (origin) => {
    const player = origin?.sourceEntity
    const setting = Database.fetch("essentialcc:setting")

    // Return if the command was not a player
    if(player?.typeId !== "minecraft:player") 
      return {
        status: CustomCommandStatus.Failure,
        message: "You should be a player to run this command."
      }

    // Cooldowns
    const cooldown = cooldowns.get(player.id)
    if(cooldown?.tick >= system.currentTick) {
      return player.sendMessage(`§cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
    } else {
      cooldowns.set(player.id, {tick: system.currentTick + (config.overridePackSetting ? config.commands.cooldown : world.getPackSettings()["essentialcc:commands_cooldown"])*20})
    }

    const warps = Database.fetch("essentialcc:warps", true).filter(w => w.player === player.id)
    player.sendMessage(`§eWarp(s) list: ${warps.map(w => w.name).join(', ')}`)
  })
}
