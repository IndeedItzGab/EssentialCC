import { world, system } from "@minecraft/server"
let tempCache = []

export function process() {
  world.getPlayers().forEach(player => {
    if(!player.hasTag("essentialcc:isTp")) return;
    
    if(tempCache.some(d => d.name === player.name)) {
      if(tempCache.some(d => d.name === player.name && 
        d.recentLocation.x === Math.round(player.location.x) &&
        d.recentLocation.y === Math.round(player.location.y) &&
        d.recentLocation.z === Math.round(player.location.z)
      )) return;
      tempCache = tempCache.filter(d => d.name !== player.name)
      system.run(() => player.removeTag("essentialcc:isTp"))
      player.sendMessage(`§cYou have moved and the teleportation was cancelled.`)
    } else {
      tempCache.push({
        name: player.name,
        recentLocation: {
          x: Math.round(player.location.x),
          y: Math.round(player.location.y),
          z: Math.round(player.location.z)
        }
      })
    }
  })
}