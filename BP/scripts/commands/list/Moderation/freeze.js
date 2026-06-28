import { world, system, CustomCommandStatus, InputPermissionCategory } from "@minecraft/server"
import Database from "../../../utilities/DatabaseHandler.js"
import config from "../../../config.js"
import registerCommand from "../../CommandRegistry.js"  

const commandInformation = {
  name: "freeze",
  description: "Freeze a player making them unable to move and look around",
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
    }
  ]
}

if(config.overridePackSetting ? config.commands.allowCommands.freeze : world.getPackSettings()["essentialcc:freeze"]) {
  registerCommand(commandInformation, (origin, target, reason = "No reason provided.") => {
    if(target.length === 0)
      return {
        status: CustomCommandStatus.Failure,
        message: "Could not find that player"
      }
    
    const freezePlayers = Database.fetch("essentialcc:freezePlayers", true);

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
        freezePlayers.push({name: player.name, reason: reason})
      }
    }

    Database.store("essentialcc:freezePlayers", freezePlayers)
    return {
      status: CustomCommandStatus.Success,
      message: players.length > 1
        ? `Freezed everyone in the world: ${reason}`
        : `Freezed ${players[0].name} in the world: ${reason}`
    }
  })
}