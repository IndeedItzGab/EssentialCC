import { world } from "@minecraft/server"

import "./list/BannedPlayersHandler.js"
import "./list/PlayerSwitchedDimension.js"
import "./list/CombatValidation.js"
import "./list/MutedPlayersHandler.js"
import "./list/PlayerRankHandler.js"
import "./list/FreezedPlayersHandler.js"
import "./list/NicknameHandler.js"


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