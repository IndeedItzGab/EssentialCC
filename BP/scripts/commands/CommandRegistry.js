import { system } from "@minecraft/server";
import config  from "../config.js"

let commands = []
export default function registerCommand(comInfo, callback) {
    // Parameters Handler
    let optionalParameters = [], mandatoryParameters = []
    comInfo?.usage.forEach(parameter => {
      if(parameter.optional) {
        optionalParameters.push({
          name: parameter.name,
          type: parameter.type
        })
      } else {
        mandatoryParameters.push({
          name: parameter.name,
          type: parameter.type
        })
      }
    })
  
    // Aliases Handler
    comInfo?.aliases?.forEach(alias => {
      commands.push({
        commandInformation: {
          name: `${config.commands.namespace}:${alias}`,
          description: comInfo?.description,
          permissionLevel: comInfo?.permissionLevel || 0,
          cheatsRequired: false,
          optionalParameters: optionalParameters,
          mandatoryParameters: mandatoryParameters
        },
        callback: callback
      })
    })
    
    // Main Command Handler
    commands.push({
      commandInformation: {
        name: `${config.commands.namespace}:${comInfo?.name}`,
        description: comInfo?.description,
        permissionLevel: comInfo?.permissionLevel || 0,
        cheatsRequired: false,
        optionalParameters: optionalParameters,
        mandatoryParameters: mandatoryParameters
      },
      callback: callback
    })
}



system.beforeEvents.startup.subscribe((init) => {
  init.customCommandRegistry.registerEnum(`${config.commands.namespace}:rankMode`, ["set", "remove" ])
  init.customCommandRegistry.registerEnum(`${config.commands.namespace}:rankSelection`, [
    "owner",
    "co_owner",
    "head_admin",
    "admin",
    "trial_admin",
    "staff_manager",
    "head_moderator",
    "moderator",
    "trial_moderator",
    "assistant",
    "head_helper",
    "helper",
    "trial_helper",
    "recruiter",

    "netherite",
    "diamond",
    "gold",
    "quartz",
    "iron",
    "copper",
    "stone",
    "coal",
    "wood",

    "god",
    "king",
    "queen",
    "emperor",
    "councilor",
    "hero",
    "knight",
    "builder",
    "farmer",
    "inmate",
    "merchant",
    "mayor",
    "senior",
    "soldier",
    "veteran",
    "artist",
    "elder",
    "junior",
    "expert",
    "peasant",
    "master",
    "new",
    "newbie",
    "member",
    "youtuber",
    "warden",

    "mvp",
    "vip",
    "platinum",
    "premium",
    "champion",
    "elite",
    "legend",
    "myth",
    "epic",
    "experienced",
    "advanced",

    "founder",
    "co_founder",
    "supporter",
    "contributor",
    "donor",
    "guest",
    "sponsor"
  ])

  for(const command of commands) {
    init.customCommandRegistry.registerCommand(command.commandInformation, command.callback)
  }
})




