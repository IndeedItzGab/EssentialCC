import { world, system } from "@minecraft/server"
import Database from "../../utilities/DatabaseHandler.js"


export function MutedPlayersHandler(event) {
  let mutedPlayers = Database.fetch("essentialcc:mutedPlayers", true);
  const muteData = mutedPlayers.find(d => d.name === event.sender.name)
  if(muteData) {
    if(muteData?.duration > Date.now()) {
      // A handler for players that were muted with durations
      const days = Math.floor((muteData.duration - Date.now()) / 1000 / 60 / 60 / 24)
      const hours = (Math.floor((muteData.duration - Date.now()) / 1000 / 60 / 60)) % 24
      const minutes = (Math.floor((muteData.duration - Date.now()) / 1000 / 60)) % 60
      const seconds = (Math.floor((muteData.duration - Date.now()) / 1000)) % 60
      const lastDurations = `${days > 0 ? days + 'd, ' : ''}${hours > 0 ? hours + 'h, ' : ''}${minutes > 0 ? minutes + 'm, ' : ''}${seconds > 0 ? seconds + 's' : ''}`
      event.sender.sendMessage(`§cYou cannot send any messages until ${lastDurations}`)
      event.cancel = true;
    } else if(!muteData.duration) {
      // A handler for players that were muted permanently or no durations
      event.sender.sendMessage("§cYou cannot send any messages while being muted.")
      event.cancel = true;
    } else {
      // A handler for players if the system tick already exceed player's mute duration
      Database.store("essentialcc:mutedPlayers", mutedPlayers.filter(d => d.name !== event.sender.name))
    }
  }
}