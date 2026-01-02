import { world, system} from "@minecraft/server"
import * as db from "../../utilities/DatabaseHandler.js"

world.afterEvents.playerDimensionChange.subscribe(event => {
  const lockedDimensions = db.fetch("essentialcc:lockedDimensions", true);
  
  if(lockedDimensions.some(d => d.dimension === event.toDimension.id)) {
    const spawnpoint = event.player.getSpawnPoint() || world.getDefaultSpawnLocation()
    const dimension = world.getDimension(spawnpoint?.dimension?.id || "minecraft:overworld")
    system.run(() => event.player.tryTeleport({x: spawnpoint.x, y: spawnpoint.y, z: spawnpoint.z}, {dimension: dimension}))
    event.player.sendMessage(`§cThat dimension was locked by an Operator`)
  }
})

world.afterEvents.playerSpawn.subscribe(event => {
  if(!event.initialSpawn) return;
  const lockedDimensions = db.fetch("essentialcc:lockedDimensions", true)

  if(lockedDimensions.some(d => d.dimension === event.player.dimension.id)) {
    const spawnpoint = event.player.getSpawnPoint() || world.getDefaultSpawnLocation()
    const dimension = world.getDimension(spawnpoint?.dimension?.id || "minecraft:overworld")
    system.run(() => event.player.tryTeleport({x: spawnpoint.x, y: spawnpoint.y, z: spawnpoint.z}, {dimension: dimension}))
    event.player.sendMessage(`§cThat dimension was locked by an Operator`)
  }
})