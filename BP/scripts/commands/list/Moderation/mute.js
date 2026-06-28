import registerCommand from "../../CommandRegistry.js"  
import { world, system, CustomCommandStatus } from "@minecraft/server"
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"
import ParseDuration from "../../../utilities/ParseDuration.js"

const commandInformation = {
  name: "mute",
  description: "Mute a player from chatting in the game.",
  permissionLevel: 1,
  aliases: [],
  usage: [
    {
      name: "player",
      type: "PlayerSelector", // Supports @a, @s, @r, and @p
      optional: false,
    },
    {
      name: "reason",
      type: "String",
      optional: true
    },
    {
      name: "duration",
      type: "String",
      optional: true
    }
  ]
}

if(config.overridePackSetting ? config.commands.allowCommands.mute : world.getPackSettings()["essentialcc:mute"]) {
  registerCommand(commandInformation, (origin, target, reason = "No reason provided.", duration) => {

    if(target.length === 0)
      return {
        status: CustomCommandStatus.Failure,
        message: "Could not find that player"
      }
    
    let mutedPlayers = Database.fetch("essentialcc:mutedPlayers", true);

    if(duration) {
      var parsedDuration = ParseDuration(duration)
      if(isNaN(parsedDuration))
        return {
          status: CustomCommandStatus.Failure,
          message: parsedDuration
        } 
    }
  
    // For @a
    let players = []
    for(const p of target) {
      const player = world.getPlayers().find(player => player.id === p.id)
      players.push(player)

      player.sendMessage("§cYou have been muted by an Operator")
      mutedPlayers = mutedPlayers.filter(p => p.name !== player.name) // Overriding thing
      mutedPlayers.push({name: player.name, reason: reason, duration: parsedDuration})
    }


    Database.store("essentialcc:mutedPlayers", mutedPlayers)

    return {
      status: CustomCommandStatus.Success,
      message: players.length > 1
        ? `Muted everyone from the game: ${reason}`
        : `Muted ${players[0].name} from the game: ${reason}`
    }
  })
}