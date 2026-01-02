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
      home: true
    }
  }
}