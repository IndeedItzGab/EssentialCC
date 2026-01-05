import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"


//! Currently it used system's tick which is not a good idea for handling these types of feature.
//! Therefore, we will soon use the literal date time from the actual machine
world.beforeEvents.chatSend.subscribe(event => {
  let mutedPlayers = db.fetch("essentialcc:mutedPlayers", true);
  const muteData = mutedPlayers.find(d => d.name === event.sender.name)
  if(muteData) {
    if(muteData?.duration > system.currentTick) {
      // A handler for players that were muted with durations
      const days = Math.floor((muteData.duration - system.currentTick) / 20 / 60 / 60 / 24)
      const hours = (Math.floor((muteData.duration - system.currentTick) / 20 / 60 / 60)) % 24
      const minutes = (Math.floor((muteData.duration - system.currentTick) / 20 / 60)) % 60
      const seconds = (Math.floor((muteData.duration - system.currentTick) / 20)) % 60
      const lastDurations = `${days > 0 ? days + 'd, ' : ''}${hours > 0 ? hours + 'h, ' : ''}${minutes > 0 ? minutes + 'm, ' : ''}${seconds > 0 ? seconds + 's' : ''}`
      event.sender.sendMessage(`§cYou cannot send any messages until ${lastDurations}`)
      event.cancel = true;
    } else if(!muteData.duration) {
      // A handler for players that were muted permanently or no durations
      event.sender.sendMessage("§cYou cannot send any messages while being muted.")
      event.cancel = true;
    } else {
      // A handler for players if the system tick already exceed player's mute duration
      db.store("essentialcc:mutedPlayers", mutedPlayers.filter(d => d.name !== event.sender.name))
    }
  }
})