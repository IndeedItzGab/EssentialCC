import { world, system } from "@minecraft/server"
import Database from "../../utilities/DatabaseHandler.js"

world.afterEvents.entityHurt.subscribe((event) => {
  const suspect = event.damageSource.damagingEntity
  const victim = event.hurtEntity

  try {
    if(suspect?.typeId === "minecraft:player" && suspect.getDynamicProperty("teleporting")) {
      suspect.setDynamicProperty("teleporting", false)
      suspect.sendMessage("§cYou got in a combat and your teleportation was cancelled.")
    } else if(victim?.typeId === "minecraft:player" && victim.getDynamicProperty("teleporting")) {
      victim.setDynamicProperty("teleporting", false)
      victim.sendMessage("§cYou got in a combat and your teleportation was cancelled.")
    }
    
    if(victim?.typeId === "minecraft:player")
      victim.setDynamicProperty("hurted", Date.now() + (15*1000))
    if(suspect?.typeId === "minecraft:player")
      suspect.setDynamicProperty("hurted", Date.now() + (15*1000))
    
  } catch (error) {
    console.error(error)
  } 
})