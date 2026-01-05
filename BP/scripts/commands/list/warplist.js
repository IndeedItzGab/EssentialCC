import { registerCommand } from "../CommandRegistry"  
import * as db from "../../utilities/DatabaseHandler.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "warplist",
  description: "List all warps available.",
  aliases: [],
  usage: []
}

if(config.commands.allowCommands.warplist) {
  registerCommand(commandInformation, (origin) => {
    const executor = origin?.sourceEntity

    // Return if the command was not a player
    if(executor?.typeId !== "minecraft:player") return console.log("You should be a player to run this command.")

    let warps = db.fetch("essentialcc:warps", true).filter(w => w.player === executor.id)

    executor.sendMessage(`§eWarp(s) list: ${warps.map(w => w.name).join(', ')}`)
  })
}
