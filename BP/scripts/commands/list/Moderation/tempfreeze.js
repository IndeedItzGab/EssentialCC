import registerCommand from "../../CommandRegistry.js"  
import { world, system, CustomCommandStatus, InputPermissionCategory } from "@minecraft/server"
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"
import ParseDuration from "../../../utilities/ParseDuration.js"

const commandInformation = {
  name: "tempfreeze",
  description: "Temporarily freeze a player making them unable to move and look around",
  permissionLevel: 1,
  aliases: [],
  usage: [
    {
      name: "player",
      type: "PlayerSelector", // Supports @a, @s, @r, and @p
      optional: false,
    },
    {
      name: "duration",
      type: "String",
      optional: false
    },
    {
      name: "reason",
      type: "String",
      optional: true
    }
  ]
}

if(config.overridePackSetting ? config.commands.allowCommands.tempfreeze : world.getPackSettings()["essentialcc:tempfreeze"]) {
  registerCommand(commandInformation, (origin, target, duration, reason = "No reason provided.") => {
    if(target.length === 0)
      return {
        status: CustomCommandStatus.Failure,
        message: "Could not find that player"
      }

    const freezePlayers = Database.fetch("essentialcc:freezePlayers", true);

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
      system.run(() => {
        player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, false)
        player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false)
      })
      players.push(player)

      if(!freezePlayers.some(p => p.name == player.name)) {
        freezePlayers.push({name: player.name, reason: reason, duration: parsedDuration})
      };
    }


    Database.store("essentialcc:freezePlayers", freezePlayers)
    return {
      status: CustomCommandStatus.Success,
      message: players.length > 1
        ? `Temporarily freezed everyone in the game: ${reason}`
        : `Temporarily freezed ${players[0].name} in the game: ${reason}`
    }
  })
}