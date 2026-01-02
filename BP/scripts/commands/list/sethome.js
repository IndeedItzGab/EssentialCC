import { registerCommand } from "../CommandRegistry"  
import * as db from "../../utilities/DatabaseHandler.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "sethome",
  description: "Set your own home location",
  aliases: [],
  usage: []
}

if(config.commands.allowCommands.sethome) {
  registerCommand(commandInformation, (origin) => {
    const executor = origin?.sourceEntity

    // Return if the command was not a player
    if(executor?.typeId !== "minecraft:player") return console.log("You should be a player to run this command.")

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
