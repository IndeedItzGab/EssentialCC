import { system } from "@minecraft/server"
import * as PlayerMoveValidation from "./list/PlayerMoveValidation.js"

system.runInterval(() => {
  PlayerMoveValidation.process();
}, 1*20)