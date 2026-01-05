import { registerCommand } from "../CommandRegistry"  
import * as db from "../../utilities/DatabaseHandler.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "delwarp",
  description: "Delete the specified warp",
  aliases: [],
  usage: [
    {
      name: "name",
      type: "String",
      optional: false
    }
  ]
}

if(config.commands.allowCommands.delwarp) {
  registerCommand(commandInformation, (origin, name) => {
    const executor = origin?.sourceEntity

    // Return if the command was not a player
    if(executor?.typeId !== "minecraft:player") return console.log("You should be a player to run this command.")

    let warps = db.fetch("essentialcc:warps", true)
    if(!warps.some(d => d.player === executor.id && d.name === name)) return executor.sendMessage(`§cThat warp does not exist!`)
      
    warps = warps.filter(d => !(d.player === executor.id && d.name === name))

    db.store("essentialcc:warps", warps)
    executor.sendMessage(`§aYou just deleted "${name}" warp`)
  })
}
