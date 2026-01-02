
export function logReply(sourceEntity, string) {
  !sourceEntity ? console.info(string) : sourceEntity.sendMessage(string)
}