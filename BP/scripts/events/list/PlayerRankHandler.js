import { world } from "@minecraft/server"
import { RankHandler } from "../../utilities/RankHandler";

export function PlayerRankHandler(event) {
  if(!event.player?.id) return;
  RankHandler.update(event.player.id);
}