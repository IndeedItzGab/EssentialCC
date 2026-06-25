import { registerCommand } from "../../CommandRegistry.js"  
import { world, system } from "@minecraft/server"
import * as db from "../../../utilities/DatabaseHandler.js"
import { config } from "../../../config.js"

const commandInformation = {
  name: "tps",
  description: "Check your the server's tick per seconds.",
  aliases: [],
  usage: []
}

let ticks = 0;
const history = [];
const tickStart = Date.now()

system.runInterval(() => {
    ticks++;
});

system.runInterval(() => {
    history.push({
        tick: ticks,
        time: Date.now()
    });

    // Keep only 10 minutes
    if (history.length > 600) {
        history.shift();
    }
}, 20);

function getTPS(seconds) {
    const index = history.length - seconds;

    if (index < 0) return "N/A";

    const old = history[index];
    const tickDiff = ticks - old.tick;
    const timeDiff = (Date.now() - old.time) / 1000;

    return Math.min(20, tickDiff / timeDiff).toFixed(2);
}



if(config.overridePackSetting ? config.commands.allowCommands.tps : world.getPackSettings()["essentialcc:tps"]) {
  const cooldowns = new Map()
  registerCommand(commandInformation, (origin) => {
    const executor = origin?.sourceEntity
    const setting = db.fetch("essentialcc:setting")

    const cooldown = cooldowns.get(executor.id)
    if(cooldown?.tick >= system.currentTick) {
      return executor.sendMessage(`§cYou need to wait another ${(cooldown.tick - system.currentTick) / 20} seconds before running that!'`)
    } else {
      cooldowns.set(executor.id, {tick: system.currentTick + (config.overridePackSetting ? config.commands.cooldown : world.getPackSettings()["essentialcc:commands_cooldown"])*20})
    }

    const elapsedSeconds = (Date.now() - tickStart) / 1000;
    const tick5s = getTPS(5)
    const tick10s = getTPS(10)
    const tick60s = getTPS(60)
    const tick5m = getTPS(300)
    const tick10m = getTPS(600)

    executor.sendMessage(`§7TPS from last 5s, 10s, 1m, 5m, 10m,
§a${tick5s}§7, §a${tick10s}§7, §a${tick60s}§7, §a${tick5m}§7, §a${tick10m}
§7Average TPS: §a${Math.min(20, (ticks / elapsedSeconds).toFixed(2))}`)
  })
}
