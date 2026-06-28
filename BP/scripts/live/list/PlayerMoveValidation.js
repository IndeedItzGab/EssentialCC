import { world } from "@minecraft/server"

const tempCache = new Map()
export default function PlayerMoveValidation() {
  for(const player of world.getPlayers().filter(p => p.getDynamicProperty("teleporting"))) {
    if(!player.id) continue; // Avoid processing simulated players (non actual players) from gametest
    
    const cached = tempCache.get(player.id);
    const pos = {
      x: Math.floor(player.location.x),
      y: Math.floor(player.location.y),
      z: Math.floor(player.location.z)
    };

    if(cached && !(cached.x === pos.x && cached.y === pos.y && cached.z === pos.z)) {
      tempCache.delete(player.id)
      player.sendMessage(`§cYou have moved and the teleportation was cancelled.`)
      player.setDynamicProperty("teleporting", false)
    } else {
      tempCache.set(player.id, pos)
    }
  }
}