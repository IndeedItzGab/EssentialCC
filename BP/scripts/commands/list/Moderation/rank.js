import registerCommand from "../../CommandRegistry.js"  
import { world, system, CustomCommandStatus } from "@minecraft/server"
import config from "../../../config.js"
import { ranks, RankHandler } from "../../../utilities/RankHandler.js"

const commandInformation = {
  name: "rank",
  description: "Manage the ranks in this world.",
  permissionLevel: 1,
  aliases: [],
  usage: [
    {
      name: `${config.commands.namespace}:rankMode`,
      type: "Enum",
      optional: false,
    },
    {
      name: "target",
      type: "PlayerSelector",
      optional: false
    },
    {
      name: `${config.commands.namespace}:rankSelection`,
      type: "Enum",
      optional: true
    }
    
  ]
}

if(config.overridePackSetting ? config.commands.allowCommands.rank : world.getPackSettings()["essentialcc:rank"]) {
  registerCommand(commandInformation, (origin, mode, target, selection) => {
    if(target.length === 0)
      return {
        status: CustomCommandStatus.Failure,
        message: "Could not find that player"
      }
    if(!["set", "remove"].includes(mode))
      return {
        status: CustomCommandStatus.Failure,
        message: "That command does not exist"
      }
    // For @a
    let players = []
    for(const p of target) {
      const player = world.getPlayers().find(player => player.id === p.id)
      players.push(player)

      if(mode === "set") {
        if(!ranks[selection])
          return {
            status: CustomCommandStatus.Failure,
            message: "The specified rank is invalid"
          }
        RankHandler.set(player.id, ranks[selection])
      } else if(mode === "remove") {
        RankHandler.remove(player.id)
      }
    }
    
    if(mode === "set") {
      var res = players.length > 1
        ? "You have successfully set everyone's rank"
        : `You have successfully set ${players[0].name}'s rank`
    } else if(mode === "remove") {
      var res =  players.length > 1
        ? "You have successfully removed everyone's rank"
        : `You have successfully removed ${players[0].name}'s rank`
    }
    
    return {
      status: CustomCommandStatus.Success,
      message: res
    }
  })
}
