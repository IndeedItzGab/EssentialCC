export const config = {
  commands: {
    namespace: "essentialcc",
    cooldown: 30,
    allowCommands: {
      ban: true,
      banlist: true,
      tempban: true,
      pardon: true,
      lockdimension: true,
      unlockdimension: true,
      nickname: true,
      sethome: true,
      home: true,
      mute: true,
      unmute: true,
      kickall: true,
      realname: true,
      suicide: true,
      setwarp: true,
      warp: true,
      delwarp: true,
      warplist: true,
      tps: true,
      rank: true,
      burn: true
    },
    settings: {
      warp: {
        max: 3
      }
    }
  }
}