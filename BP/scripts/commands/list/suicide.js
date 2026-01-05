import { registerCommand } from "../CommandRegistry"  
import { system } from "@minecraft/server"
import { logReply } from "../../utilities/LogReply.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "suicide",
  description: "Cause yourself to die instantly",
  usage: []
}

if(config.commands.allowCommands.suicide) {
  registerCommand(commandInformation, (origin) => {
    const executor = origin?.sourceEntity
    if(executor?.typeId !== "minecraft:player") return console.log("Only a player can run this command")
    
    executor.sendMessage("§eYou just killed yourself.")
    system.run(() => executor.kill())
  })
}
