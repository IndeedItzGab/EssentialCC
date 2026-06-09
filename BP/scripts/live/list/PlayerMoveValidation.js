import { world, system } from "@minecraft/server"

let tempCache = new Map()
export function process() {
  for(const player of world.getPlayers()) {
    if(!player.id) continue; // Avoid processing simulated players (non actual players) from gametest
    
    if(!player.hasTag("essentialcc:isTp")) {
      tempCache.delete(player.id);
      continue;
    };
    
    const cached = tempCache.get(player.id);
    const pos = {
      x: Math.floor(player.location.x),
      y: Math.floor(player.location.y),
      z: Math.floor(player.location.z)
    };

    if(cached) {
      if(cached.x === pos.x && cached.y === pos.y && cached.z === pos.z) continue;
      tempCache.delete(player.id)
      player.sendMessage(`§cYou have moved and the teleportation was cancelled.`)
      system.run(() => player.removeTag("essentialcc:isTp"));
    } else {
      tempCache.set(player.id, pos)
    }
  }
}