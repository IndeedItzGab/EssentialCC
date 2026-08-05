import { world, system} from "@minecraft/server"
import Database from "../../utilities/DatabaseHandler.js"

export default class PlayerSwitchedDimension {

  static #getLockedDimensions() {
    return Database.fetch("essentialcc:lockedDimensions", true);
  }

  static dimensionChangedEvent(event) {
    if(this.#getLockedDimensions().some(d => d.dimension === event.toDimension.id && (d.duration >= Date.now() || !d.duration))) {
      const spawnpoint = event.player.getSpawnPoint() || world.getDefaultSpawnLocation()
      const dimension = world.getDimension(spawnpoint?.dimension?.id || "minecraft:overworld")
      system.run(() => event.player.tryTeleport({x: spawnpoint.x, y: dimension.getTopmostBlock({x : spawnpoint.x, z: spawnpoint.z}).location.y + 1, z: spawnpoint.z}, {dimension: dimension}))
      event.player.sendMessage(`§cThat dimension was locked by an Operator`)
    } else if(this.#getLockedDimensions().some(d => d.dimension === event.toDimension.id && d.duration <= Date.now())) {
      Database.store("essentialcc:lockedDimensions", this.#getLockedDimensions().filter(d => d.dimension !== event.toDimension.id))
    }
  }

  static playerSpawnedEvent(event) {
    if(this.#getLockedDimensions().some(d => d.dimension === event.player.dimension.id && (d.duration >= Date.now() || !d.duration))) {
      const spawnpoint = event.player.getSpawnPoint() || world.getDefaultSpawnLocation()
      const dimension = world.getDimension(spawnpoint?.dimension?.id || "minecraft:overworld")
      system.run(() => event.player.tryTeleport({x: spawnpoint.x, y: spawnpoint.y, z: spawnpoint.z}, {dimension: dimension}))
      event.player.sendMessage(`§cThat dimension was locked by an Operator`)
    } else if(this.#getLockedDimensions().some(d => d.dimension === event.toDimension?.id && d.duration <= Date.now())) {
      Database.store("essentialcc:lockedDimensions", this.#getLockedDimensions().filter(d => d.dimension !== event.toDimension?.id))
    }
  }
}