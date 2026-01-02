import { world, system } from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"

world.afterEvents.entityHurt.subscribe((event) => {
  if(event.damageSource.damagingEntity?.typeId !== "minecraft:player" || event.hurtEntity?.typeId !== "minecraft:player") return

  let combatData = db.fetch("essentialcc:combatData", true)
  const suspect = event.damageSource.damagingEntity
  const victim = event.hurtEntity
  const victimData = combatData.find(d => d.name === event.hurtEntity.name)
  const suspectData = combatData.find(d => d.name === event.damageSource.damagingEntity.name)

  try {
    if(suspect.hasTag("essentialcc:isTp")) {
      suspect.removeTag("essentialcc:isTp")
      suspect.sendMessage("§cYou got in a combat and your teleportation was cancelled.")
    } else if(victim.hasTag("essentialcc:isTp")) {
      victim.removeTag("essentialcc:isTp")
      victim.sendMessage("§cYou got in a combat and your teleportation was cancelled.")
    }

    !victimData ? 
      combatData.push({ name: event.hurtEntity.name, time: system.currentTick + (15*20)}) :
      victimData.time = system.currentTick + (15*20)

    !suspectData ?
      combatData.push({ name: event.damageSource.damagingEntity.name, time: system.currentTick + (15*20)}) :
      suspectData.time = system.currentTick + (15*20)

    db.store("essentialcc:combatData", combatData)
  } catch (error) {
    console.error(error)
  } 
})