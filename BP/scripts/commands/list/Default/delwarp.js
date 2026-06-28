import registerCommand from "../../CommandRegistry.js"  
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"
import { system, world, CustomCommandResult } from "@minecraft/server" 

const commandInformation = {
  name: "delwarp",
  description: "Delete the specified warp.",
  aliases: [],
  usage: [
    {
      name: "name",
      type: "String",
      optional: false
    }
  ]
}

if(config.overridePackSetting ? config.commands.allowCommands.delwarp : world.getPackSettings()["essentialcc:delwarp"]) {
  const cooldowns = new Map()
  registerCommand(commandInformation, (origin, name) => {
    const player = origin?.sourceEntity
    const setting = Database.fetch("essentialcc:setting")

    // Return if the command was not a player
    if(player?.typeId !== "minecraft:player") 
      return {
        status: CustomCommandResult.Failure,
        message: "You should be a player to run this command."
      }
    
    // Cooldown
    const cooldown = cooldowns.get(player.id)
    if(cooldown?.tick >= system.currentTick) {
      return player.sendMessage(`§cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
    } else {
      cooldowns.set(player.id, {tick: system.currentTick + (config.overridePackSetting ? config.commands.cooldown : world.getPackSettings()["essentialcc:commands_cooldown"])*20})
    }

    const warps = Database.fetch("essentialcc:warps", true)
    if(!warps.some(d => d.player === player.id && d.name === name))
      return player.sendMessage(`§cThat warp does not exist!`)
    
    Database.store("essentialcc:warps", warps.filter(d => !(d.player === player.id && d.name === name)))
    player.sendMessage(`§aYou just deleted "${name}" warp`)
  })
}
