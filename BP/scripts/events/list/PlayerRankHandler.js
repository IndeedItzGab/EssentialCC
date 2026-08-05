import { world } from "@minecraft/server"
import { RankHandler } from "../../utilities/RankHandler";

export default (event) => {
  if(!event.player?.id) return;
  RankHandler.update(event.player.id);
}