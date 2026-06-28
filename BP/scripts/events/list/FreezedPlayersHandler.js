import { world, system, InputPermissionCategory } from "@minecraft/server"
import Database from "../../utilities/DatabaseHandler.js"

world.afterEvents.playerSpawn.subscribe((event) => {
  const freezePlayers = Database.fetch("essentialcc:freezePlayers", true);
  const freezeData = freezePlayers.find(p => p.name === event.player.name)
  
  if(freezeData) {
    if(freezeData?.duration >= Date.now()) {
      // A handler for players that were muted with durations
      const days = Math.floor((freezeData.duration - Date.now()) / 1000 / 60 / 60 / 24)
      const hours = (Math.floor((freezeData.duration - Date.now()) / 1000 / 60 / 60)) % 24
      const minutes = (Math.floor((freezeData.duration - Date.now()) / 1000 / 60)) % 60
      const seconds = (Math.floor((freezeData.duration - Date.now()) / 1000)) % 60
      const lastDurations = `${days > 0 ? days + 'd, ' : ''}${hours > 0 ? hours + 'h, ' : ''}${minutes > 0 ? minutes + 'm, ' : ''}${seconds > 0 ? seconds + 's' : ''}`
      system.run(() => {
        event.player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, false)
        event.player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false)
      })
      
      event.player.sendMessage(`You were temporarily freezed by an operator for ${lastDurations}: ${freezeData.reason}`)
    } else if(!freezeData.duration) {
      system.run(() => {
        event.player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, false)
        event.player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false)
      })
      event.player.sendMessage(`You were freezed by an operator: ${freezeData.reason}`)
    } else {
      Database.store("essentialcc:freezePlayers", freezePlayers.filter(p => p.name !== event.player.name))
    }
  }
})