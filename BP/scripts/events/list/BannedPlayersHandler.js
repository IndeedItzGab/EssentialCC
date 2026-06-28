import { world, system } from "@minecraft/server"
import Database from "../../utilities/DatabaseHandler.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  if(!event.initialSpawn) return;
  const bannedPlayers = Database.fetch("essentialcc:bannedPlayers", true);

  const banData = bannedPlayers.find(p => p.name === event.player.name)
  
  if(banData ) {
    if(banData?.duration >= Date.now()) {
      // A handler for players that were muted with durations
      const days = Math.floor((banData.duration - Date.now()) / 1000 / 60 / 60 / 24)
      const hours = (Math.floor((banData.duration - Date.now()) / 1000 / 60 / 60)) % 24
      const minutes = (Math.floor((banData.duration - Date.now()) / 1000 / 60)) % 60
      const seconds = (Math.floor((banData.duration - Date.now()) / 1000)) % 60
      const lastDurations = `${days > 0 ? days + 'd, ' : ''}${hours > 0 ? hours + 'h, ' : ''}${minutes > 0 ? minutes + 'm, ' : ''}${seconds > 0 ? seconds + 's' : ''}`
      system.run(() => event.player.runCommand(`kick @s You were temporarily banned in this server for ${lastDurations}: ${banData.reason}`))
    } else if(!banData.duration) {
      system.run(() => event.player.runCommand(`kick @s You were banned in this server: ${banData.reason}`))
    } else {
      Database.store("essentialcc:bannedPlayers", bannedPlayers.filter(p => p.name !== event.player.name))
    }
  }
})