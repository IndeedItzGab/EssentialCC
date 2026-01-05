export const config = {
  commands: {
    namespace: "essentialcc",
    cooldown: 30, // Per second (NOT IMPLEMENTED)
    allowCommands: {
      ban: true,
      banlist: true,
      pardon: true,
      lockdimension: true,
      unlockdimension: true,
      nickname: true,
      sethome: false,
      home: true,
      mute: true,
      unmute: true,
      kickall: true,
      realname: true,
      suicide: true,
      setwarp: true,
      warp: true,
      delwarp: true,
      warplist: true
    },
    settings: {
      warp: {
        max: 3
      }
    }
  }
}