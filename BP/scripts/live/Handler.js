import { system } from "@minecraft/server"
import PlayerMoveValidation from "./list/PlayerMoveValidation"
import FreezedDurationHandler from "./list/FreezedDurationHandler"

system.runInterval(() => {
  PlayerMoveValidation()
  FreezedDurationHandler()
}, 1*5)