export default {
  // ! NOTE: If you are going to configure the pack through this file, then you must set overridePackSetting to "true".
  // ! Otherwise, the script will ignore these changes you made from this file.
  // ! On the other hand, if you were going to configure this pack through "Pack Setting" or the gear icon you see in-game right-bottom of the pack. Then, you must set overridePackSetting to false to apply changes from that setting.
  overridePackSetting: false, 

  commands: {
    namespace: "essentialcc",
    cooldown: 15,
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
      burn: true,
      freeze: true,
      unfreeze: true,
      tempfreeze: true
    },
    settings: {
      warp: {
        max: 3
      }
    }
  }
}