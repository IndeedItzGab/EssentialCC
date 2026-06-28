import { world, system, InputPermissionCategory } from "@minecraft/server"
import Database from "../../utilities/DatabaseHandler"

export default function FreezedDurationHandler() {
  const freezePlayers = Database.fetch("essentialcc:freezePlayers", true)
  
  for(const data of freezePlayers.filter(d => d.duration <= Date.now())) {
    const player = world.getPlayers().find(p => p?.name?.toLowerCase() === data?.name?.toLowerCase())
    if(player) {
      system.run(() => {
        player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, true)
        player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true)
        player.sendMessage("You have been automatically unfreezed.")
      })
    }
    Database.store("essentialcc:freezePlayers", freezePlayers.filter(d => d.name !== data.name))
  }
}