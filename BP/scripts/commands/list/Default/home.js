import registerCommand from "../../CommandRegistry.js"  
import { world, system, CustomCommandStatus } from "@minecraft/server"
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"

const commandInformation = {
  name: "home",
  description: "Teleport to the location of your home.",
  aliases: [],
  usage: []
}


if(config.overridePackSetting ? config.commands.allowCommands.home : world.getPackSettings()["essentialcc:home"]) {
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


    const cooldown = cooldowns.get(player.id)
      if(cooldown?.tick >= system.currentTick) {
        return player.sendMessage(`§cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
      } else {
        cooldowns.set(player.id, {tick: system.currentTick + (config.overridePackSetting ? config.commands.cooldown : world.getPackSettings()["essentialcc:commands_cooldown"])*20})
      }

    const home = Database.fetch("essentialcc:homes", true).find(h => h.player === player.name)
    if(player.getDynamicProperty("hurted") >= Date.now())
      return player.sendMessage("§cYou can't use this command while in combat with other player.")
    if(!home)
      return player.sendMessage("§cYou do not have home location")
    
    player.sendMessage(`§eYou will be teleported in 5 seconds, don't move.`)
    player.setDynamicProperty("teleporting", true)
    system.runTimeout(() => {
      if(player.getDynamicProperty("teleporting")) {
        const dimension = world.getDimension(home.dimension)
        player.tryTeleport({x: home.location.x, y: home.location.y, z: home.location.z}, {dimension: dimension})
        player.sendMessage(`§aYou have been teleported to your home.`)
        player.setDynamicProperty("teleporting", false)
      }
    },5*20)
  })
}
