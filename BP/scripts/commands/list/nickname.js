import { registerCommand } from "../CommandRegistry"  
import { world, system } from "@minecraft/server"
import { logReply } from "../../utilities/LogReply.js"
import { config } from "../../config.js"

const commandInformation = {
  name: "nickname",
  description: "Set a new nickname to a specifc player(s)",
  permissionLevel: 1,
  aliases: ["nick"],
  usage: [
    {
      name: "player",
      type: "PlayerSelector", // Supports @a, @s, @r, and @p
      optional: false,
    },
    {
      name: "nickname",
      type: "String",
      optional: true
    }
  ]
}

const NICK_PROP = "nickname";

/* 1️⃣ Register dynamic property (safe way) */
let registered = false;

world.afterEvents.playerSpawn.subscribe(ev => {
  if (registered) return;
  registered = true;

  world.propertyRegistry.registerString(NICK_PROP, 64);
});

/* ─────────────────────────────
   2️⃣ Nickname helpers
   ───────────────────────────── */
/*function getNickname(player) {
  return player.getDynamicProperty(NICK_PROP);
}*/

function setNickname(player, nickname) {
  player.setDynamicProperty(NICK_PROP, nickname);
  player.nameTag = nickname;
}

/* ─────────────────────────────
   3️⃣ Re-apply nickname on join
   ───────────────────────────── */
world.afterEvents.playerSpawn.subscribe(ev => {
  if (!ev.initialSpawn) return;

  const player = ev.player;
  const nickname = player.getDynamicProperty(NICK_PROP);

  if (nickname) {
    player.nameTag = nickname;
  }
});

/* ─────────────────────────────
   4️⃣ Chat interception
   ───────────────────────────── */
world.beforeEvents.chatSend.subscribe(ev => {
  const player = ev.sender;
  const nickname = player.getDynamicProperty(NICK_PROP) || player.name;

  ev.cancel = true;
  world.sendMessage(`${nickname}${':'} §r${ev.message}`);
});

if(config.commands.allowCommands.nickname) {
  registerCommand(commandInformation, (origin, target, nickname) => {
    const executor = origin?.sourceEntity
    if(target.length === 0) return logReply(executor, "§cCould not find that player")
    
    if (nickname.length > 24)
    return logReply(executor, "§cNickname too long");
    nickname = nickname.replace(/§k/g, "");
    
    // For @a
    let players = []
    for(const p of target) {
      const player = world.getPlayers().find(player => player.id === p.id)
      players.push(player)
      system.run(() => setNickname(player, nickname));
    }

    players.length > 1 ? logReply(executor, `§eYou have successfully changed everyone's nickname`) : logReply(executor, `§eYou have successfully changed ${players[0].name}'s nickname`)
  })
}
