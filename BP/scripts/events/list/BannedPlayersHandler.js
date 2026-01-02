import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  const bannedPlayers = db.fetch("essentialcc:bannedPlayers", true);

  const banData = bannedPlayers.find(p => p.name === event.player.name)
  if(banData) {
    system.run(() => event.player.runCommand(`kick @s You were banned in this server: ${banData.reason}`))
  }
})