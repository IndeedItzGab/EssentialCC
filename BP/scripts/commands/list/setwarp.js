import { registerCommand } from "../CommandRegistry"  
import * as db from "../../utilities/DatabaseHandler.js"
import { config } from "../../config.js"

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

if(config.commands.allowCommands.setwarp) {
  registerCommand(commandInformation, (origin, name) => {
    const executor = origin?.sourceEntity

    // Return if the command was not a player
    if(executor?.typeId !== "minecraft:player") return console.log("You should be a player to run this command.")

    let warps = db.fetch("essentialcc:warps", true)
    if(warps.filter(d => d.player === executor.id).length >= config.commands.settings.warp.max) return executor.sendMessage(`§cYou have already reached the maximum warps count!`)
    if(warps.some(d => (d.player === executor.id && d.name === name))) return executor.sendMessage(`§cThat warp's name already exists!`)
      
    warps.push({
      name: name,
      player: executor.id,
      dimension: executor.dimension.id,
      location: {
        x: executor.location.x,
        y: executor.location.y,
        z: executor.location.z
      }
    })

    db.store("essentialcc:warps", warps)
    executor.sendMessage(`§aYou have set a warp in your current location.`)
  })
}
