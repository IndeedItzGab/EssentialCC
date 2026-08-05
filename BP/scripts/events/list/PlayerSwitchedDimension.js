import { world, system} from "@minecraft/server"
import Database from "../../utilities/DatabaseHandler.js"

export class PlayerSwitchedDimension {
  #lockedDimensions = Database.fetch("essentialcc:lockedDimensions", true);

  static dimensionChangedEvent(event) {
    if(this.#lockedDimensions.some(d => d.dimension === event.toDimension.id && d.duration >= Date.now())) {
      const spawnpoint = event.player.getSpawnPoint() || world.getDefaultSpawnLocation()
      const dimension = world.getDimension(spawnpoint?.dimension?.id || "minecraft:overworld")
      system.run(() => event.player.tryTeleport({x: spawnpoint.x, y: dimension.getTopmostBlock({x : spawnpoint.x, z: spawnpoint.z}).location.y + 1, z: spawnpoint.z}, {dimension: dimension}))
      event.player.sendMessage(`§cThat dimension was locked by an Operator`)
    } else if(this.#lockedDimensions.some(d => d.dimension === event.toDimension.id && d.duration <= Date.now())) {
      Database.store("essentialcc:lockedDimensions", this.#lockedDimensions.filter(d => d.dimension !== event.toDimension.id))
    }
  }

  static playerSpawnedEvent(event) {
    if(this.#lockedDimensions.some(d => d.dimension === event.player.dimension.id && d.duration >= Date.now())) {
      const spawnpoint = event.player.getSpawnPoint() || world.getDefaultSpawnLocation()
      const dimension = world.getDimension(spawnpoint?.dimension?.id || "minecraft:overworld")
      system.run(() => event.player.tryTeleport({x: spawnpoint.x, y: spawnpoint.y, z: spawnpoint.z}, {dimension: dimension}))
      event.player.sendMessage(`§cThat dimension was locked by an Operator`)
    } else if(this.#lockedDimensions.some(d => d.dimension === event.toDimension?.id && d.duration <= Date.now())) {
      Database.store("essentialcc:lockedDimensions", this.#lockedDimensions.filter(d => d.dimension !== event.toDimension?.id))
    }
  }
}