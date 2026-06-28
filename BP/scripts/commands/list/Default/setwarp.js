import registerCommand from "../../CommandRegistry.js"  
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"
import { system, world, CustomCommandStatus } from "@minecraft/server"

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
  registerCommand(commandInformation, (origin, firstArg) => {
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

    const warps = Database.fetch("essentialcc:warps", true)
    if(warps.filter(d => d.player === player.id).length >= (config.overridePackSetting ? config.commands.settings.warp.max : world.getPackSettings()["essentialcc:max_warps"]))
      return player.sendMessage(`§cYou have already reached the maximum warps count!`)
    if(warps.some(d => (d.player === player.id && d.name === firstArg)))
      return player.sendMessage(`§cThat warp's name already exists!`)
      
    warps.push({
      name: firstArg,
      player: player.id,
      dimension: player.dimension.id,
      location: {
        x: player.location.x,
        y: player.location.y,
        z: player.location.z
      }
    })

    Database.store("essentialcc:warps", warps)
    player.sendMessage(`§aYou have set a warp in your current location.`)
  })
}
