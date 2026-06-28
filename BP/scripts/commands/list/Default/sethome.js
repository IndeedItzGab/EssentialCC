import registerCommand from "../../CommandRegistry.js"  
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"
import { system, world, CustomCommandStatus } from "@minecraft/server"

const commandInformation = {
  name: "sethome",
  description: "Set your own home location.",
  aliases: [],
  usage: []
}


if(config.overridePackSetting ? config.commands.allowCommands.sethome : world.getPackSettings()["essentialcc:sethome"]) {
  const cooldowns = new Map()
  registerCommand(commandInformation, (origin) => {
    const player = origin?.sourceEntity
    const setting = Database.fetch("essentialcc:setting")

    // Return if the command was not a player
    if(player?.typeId !== "minecraft:player")
      return {
        status: CustomCommandResult.Failure,
        message: "You should be a player to run this command."
      }

    const cooldown = cooldowns.get(player.id)
    if(cooldown?.tick >= system.currentTick) {
      return player.sendMessage(`§cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
    } else {
      cooldowns.set(player.id, {tick: system.currentTick + (config.overridePackSetting ? config.commands.cooldown : world.getPackSettings()["essentialcc:commands_cooldown"])*20})
    }

    const homes = Database.fetch("essentialcc:homes", true)?.filter(home => home.player !== origin.sourceEntity.name)
    homes.push({
      player: player.name,
      dimension: player.dimension.id,
      location: {
        x: player.location.x,
        y: player.location.y,
        z: player.location.z
      }
    })

    Database.store("essentialcc:homes", homes)
    player.sendMessage(`§aYou have set your home in your current location.`)
  })
}
