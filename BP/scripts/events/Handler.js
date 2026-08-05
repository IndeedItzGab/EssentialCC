import { world } from "@minecraft/server"

import BannedPlayersHandler from "./list/BannedPlayersHandler.js"
import PlayerSwitchedDimension from "./list/PlayerSwitchedDimension.js"
import CombatValidation from "./list/CombatValidation.js"
import MutedPlayersHandler from "./list/MutedPlayersHandler.js"
import PlayerRankhandler from "./list/PlayerRankHandler.js"
import FreezedPlayersHandler from "./list/FreezedPlayersHandler.js"
import NicknameHandler from "./list/NicknameHandler.js"


world.afterEvents.playerSpawn.subscribe((event) => {
  if(event.initialSpawn) {
    BannedPlayersHandler(event);
    NicknameHandler(event);
    PlayerSwitchedDimension.dimensionChangedEvent(event);
  } else {
    PlayerRankHandler(event);
    FreezedPlayersHandler(event);
  }
})

world.afterEvents.entityHurt.subscribe((event) => {
  CombatValidation(event);
})

world.beforeEvents.chatSend.subscribe(event => {
  MutedPlayersHandler(event);
})

world.afterEvents.playerDimensionChange.subscribe((event) => {
  PlayerSwitchedDimension.dimensionChangedEvent(event);
})