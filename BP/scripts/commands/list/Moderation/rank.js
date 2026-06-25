import { registerCommand } from "../../CommandRegistry.js"  
import { world, system } from "@minecraft/server"
import { logReply } from "../../../utilities/LogReply.js"
import { config } from "../../../config.js"
import { ranks, RankHandler } from "../../../utilities/RankHandler.js"

const commandInformation = {
  name: "rank",
  description: "Manage the ranks in this world.",
  permissionLevel: 1,
  aliases: [],
  usage: [
    {
      name: "essentialcc:rankMode",
      type: "Enum",
      optional: false,
    },
    {
      name: "target",
      type: "PlayerSelector",
      optional: false
    },
    {
      name: "essentialcc:rankSelection",
      type: "Enum",
      optional: true
    }
    
  ]
}

if(config.overridePackSetting ? config.commands.allowCommands.rank : world.getPackSettings()["essentialcc:rank"]) {
  registerCommand(commandInformation, (origin, mode, target, selection) => {
    const executor = origin?.sourceEntity
    if(target.length === 0) return logReply(executor, "§cCould not find that player")
    if(!["set", "remove"].includes(mode)) return (executor, "§cThat enum does not exists")

    // For @a
    let players = []
    for(const p of target) {
      const player = world.getPlayers().find(player => player.id === p.id)
      players.push(player)

      if(mode === "set") {
        if(!ranks[selection]) return logReply(executor, "§cThe specified rank is invalid")
        RankHandler.set(player.id, ranks[selection])
      } else if(mode === "remove") {
        RankHandler.remove(player.id)
      }
    }

    if(mode === "set") {
      players.length > 1 ? logReply(executor, `§eYou have successfully set everyone's rank`) : logReply(executor, `§eYou have successfully set ${players[0].name}'s rank`)
    } else if(mode === "remove") {
      players.length > 1 ? logReply(executor, `§eYou have successfully removed everyone's rank`) : logReply(executor, `§eYou have successfully removed ${players[0].name}'s rank`)
    }
  })
}
