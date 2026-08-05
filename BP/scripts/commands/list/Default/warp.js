import registerCommand from "../../CommandRegistry.js"  
import { world, system, CustomCommandStatus } from "@minecraft/server"
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"

const commandInformation = {
  name: "warp",
  description: "Teleport to the location of the specified warp.",
  aliases: [],
  usage: [
    {
      name: "name",
      type: "String",
      optional: false
    }
  ]
}


if(config.overridePackSetting ? config.commands.allowCommands.warp : world.getPackSettings()["essentialcc:warp"]) {
  const cooldowns = new Map()
  registerCommand(commandInformation, (origin, name) => {
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

    const warp = Database.fetch("essentialcc:warps", true).find(w => (w.player === player.id && w.name === name))
    if(player.getDynamicProperty("hurted") >= Date.now())
      return player.sendMessage("§cYou can't use this command while in combat with other player.")
    if(!warp)
      return player.sendMessage("§cThat warp does not exists")
    
    player.sendMessage(`§eYou will be teleported in 5 seconds, don't move.`)
    player.setDynamicProperty("teleporting", true)
    system.runTimeout(() => {
      if(player.getDynamicProperty("teleporting")) {
        const dimension = world.getDimension(warp.dimension)
        player.tryTeleport({x: warp.location.x, y: warp.location.y, z: warp.location.z}, {dimension: dimension})
        player.sendMessage(`§aYou have been teleported to your warp.`)
        player.setDynamicProperty("teleporting", false)
      }
    }, 5*20)
  })
}
