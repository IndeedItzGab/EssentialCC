export function ParseDuration(duration) {
  if(!duration) return;
  if(duration.endsWith('s')) {
    // Seconds
    const parsedDuration = Date.now() + (parseInt(duration.replaceAll("s", '')) * 1000)
    if(parsedDuration < Date.now() + (60*1000)) return "§cDuration must be at least a minute."
    return parsedDuration;
  } else if(duration.endsWith('m')) {
    // Minutes
    return Date.now()+ (parseInt(duration.replaceAll("m", '')) * 60 * 1000)
  } else if(duration.endsWith('h')) {
    // Hours
    return Date.now() + (parseInt(duration.replaceAll("h", '')) * 60 * 60 * 1000)
  } else if(duration.endsWith('d')) {
    // Days
    return Date.now() + (parseInt(duration.replaceAll("d", '')) * 60 * 60 * 24 * 1000)
  } else if(duration) {
    return "§cDuration parameter must be 60s, 1m, 1h, or 1d in example."
  }
}