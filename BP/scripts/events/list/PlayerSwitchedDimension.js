import { world, system} from "@minecraft/server"
import Database from "../../utilities/DatabaseHandler.js"

world.afterEvents.playerDimensionChange.subscribe(event => {
  const lockedDimensions = Database.fetch("essentialcc:lockedDimensions", true);
  
  if(lockedDimensions.some(d => d.dimension === event.toDimension.id && d.duration >= Date.now())) {
    const spawnpoint = event.player.getSpawnPoint() || world.getDefaultSpawnLocation()
    const dimension = world.getDimension(spawnpoint?.dimension?.id || "minecraft:overworld")
    system.run(() => event.player.tryTeleport({x: spawnpoint.x, y: dimension.getTopmostBlock({x : spawnpoint.x, z: spawnpoint.z}).location.y + 1, z: spawnpoint.z}, {dimension: dimension}))
    event.player.sendMessage(`§cThat dimension was locked by an Operator`)
  } else if(lockedDimensions.some(d => d.dimension === event.toDimension.id && d.duration <= Date.now())) {
    Database.store("essentialcc:lockedDimensions", lockedDimensions.filter(d => d.dimension !== event.toDimension.id))
  }
})

world.afterEvents.playerSpawn.subscribe(event => {
  if(!event.initialSpawn) return;
  const lockedDimensions = Database.fetch("essentialcc:lockedDimensions", true)

  if(lockedDimensions.some(d => d.dimension === event.player.dimension.id && d.duration >= Date.now())) {
    const spawnpoint = event.player.getSpawnPoint() || world.getDefaultSpawnLocation()
    const dimension = world.getDimension(spawnpoint?.dimension?.id || "minecraft:overworld")
    system.run(() => event.player.tryTeleport({x: spawnpoint.x, y: spawnpoint.y, z: spawnpoint.z}, {dimension: dimension}))
    event.player.sendMessage(`§cThat dimension was locked by an Operator`)
  } else if(lockedDimensions.some(d => d.dimension === event.toDimension?.id && d.duration <= Date.now())) {
    Database.store("essentialcc:lockedDimensions", lockedDimensions.filter(d => d.dimension !== event.toDimension?.id))
  }
})