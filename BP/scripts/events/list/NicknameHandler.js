import { world, system } from "@minecraft/server";

export default (event) => {
  system.run(() => {
    const nickname = event.player.getDynamicProperty("nickname");
    if (nickname) {
      event.player.nameTag = nickname;
    }
  })
}