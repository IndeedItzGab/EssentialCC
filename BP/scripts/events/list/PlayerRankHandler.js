import { world } from "@minecraft/server"
import { RankHandler } from "../../utilities/RankHandler";

world.afterEvents.playerSpawn.subscribe((event) => {
  if(!event.player?.id) return;
  RankHandler.update(event.player.id);
})