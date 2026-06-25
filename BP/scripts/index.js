import "./commands/Handler.js"
import "./events/Handler.js"
import "./live/Handler.js"
import { world } from "@minecraft/server"

console.info("EssentialCC has started.")

console.info(JSON.stringify(world.getPackSettings()["essentialcc:pardon"]))
