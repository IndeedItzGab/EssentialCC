import { registerCommand } from "../../CommandRegistry.js"  
import * as db from "../../../utilities/DatabaseHandler.js"
import { config } from "../../../config.js"
import { system } from "@minecraft/server"

const commandInformation = {
  name: "sethome",
  description: "Set your own home location",
  aliases: [],
  usage: []
}

let cooldowns = new Map()
if(config.commands.allowCommands.sethome) {
  registerCommand(commandInformation, (origin) => {
    const executor = origin?.sourceEntity
    const setting = db.fetch("essentialcc:setting")

    // Return if the command was not a player
    if(executor?.typeId !== "minecraft:player") return console.log("You should be a player to run this command.")

    const cooldown = cooldowns.get(player.id)
    if(cooldown?.tick >= system.currentTick) {
      return player.sendMessage(`$cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
    } else {
      cooldowns.set(player.id, {tick: system.currentTick + config.commands.cooldown*20})
    }
    let homes = db.fetch("essentialcc:homes", true)
    homes = homes.filter(home => home.player !== origin.sourceEntity.name)
    homes.push({
      player: executor.name,
      dimension: executor.dimension.id,
      location: {
        x: executor.location.x,
        y: executor.location.y,
        z: executor.location.z
      }
    })

    db.store("essentialcc:homes", homes)
    executor.sendMessage(`§aYou have set your home in your current location.`)
  })
}
