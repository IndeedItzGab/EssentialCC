import registerCommand from "../../CommandRegistry.js"  
import { system, world, CustomCommandStatus } from "@minecraft/server"
import config from "../../../config.js"
import Database from "../../../utilities/DatabaseHandler.js"

const commandInformation = {
  name: "suicide",
  description: "Cause yourself to die instantly.",
  usage: []
}


if(config.overridePackSetting ? config.commands.allowCommands.suicide : world.getPackSettings()["essentialcc:suicide"]) {
  const cooldowns = new Map()
  registerCommand(commandInformation, (origin) => {
    const player = origin?.sourceEntity
    const setting = Database.fetch("essentialcc:setting")

    if(player?.typeId !== "minecraft:player")
      return {
        status: CustomCommandResult.Failure,
        message: "You should be a player to run this command."
      }

    // Cooldowns
    const cooldown = cooldowns.get(player.id)
    if(cooldown?.tick >= system.currentTick) {
      return player.sendMessage(`§cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
    } else {
      cooldowns.set(player.id, {tick: system.currentTick + (config.overridePackSetting ? config.commands.cooldown : world.getPackSettings()["essentialcc:commands_cooldown"])*20})
    }
    
    system.run(() => player.kill())
    player.sendMessage("§eYou just killed yourself.")
    
  })
}
