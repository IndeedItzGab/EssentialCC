import { world, system } from "@minecraft/server"

export const ranks = {
  // Staff things
  owner: "§eOwner",
  co_owner: "§gCo-Owner",
  head_admin: "§4Head-Admin",
  admin: "§cAdmin",
  trial_admin: "§cTrial-Admin",
  staff_manager: "§sStaff Manager",
  head_moderator: "§bHead-Moderator",
  moderator: "§dModerator",
  trial_moderator: "§uTrial-Moderator",
  assistant: "§tAssistant",
  head_helper: "§9Head-Helper",
  helper: "§bHelper",
  trial_helper: "§3Trial-Helper",
  recruiter: "§tRecruier",

  // Ingot things:
  netherite: "§jNetherite",
  diamond: "§bDiamond",
  gold: "§eGold",
  quartz: "§hQuartz",
  iron: "§7Iron",
  copper: "§6Copper",
  stone: "§iStone",
  coal: "§0Coal",
  wood: "§nWood",

  // Citezen things
  god: "§eGod",
  king: "§6King",
  queen: "§cQueen",
  emperor: "§eEmperor",
  councilor: "§5Councilor",
  hero: "§eHero",
  knight: "§jKnight",
  builder: "§bBuilder",
  farmer: "§qFarmer",
  inmate: "§iInmate",
  merchant: "§pMerchant",
  mayor: "§sMayor",
  senior: "§uSenior",
  soldier: "§qSoldier",
  veteran: "§qVeteran",
  artist: "§mArtist",
  elder: "§sElder",
  junior: "§pJunior",
  expert: "§eExpert",
  peasant: "§iPeasant",
  master: "§aMaster",
  new: "§iNew",
  newbie: "§iNewbie",
  member: "§iMember",
  youtuber: "§cYoutuber",
  warden: "§9Warden",

  // Misc
  mvp: "§eMVP",
  vip: "§eVIP",
  platinum: "§hPlatinum",
  premium: "§aPremium",
  champion: "§eChampion",
  elite: "§aElite",
  legend: "§bLegend",
  myth: "§dMyth",
  epic: "§dEpic",
  experienced: "§gExperienced",
  advanced: "§6Advanced",

  // whatever we call these
  founder: "§9Founder",
  co_founder: "§1Co-Founder",
  supporter: "§bSupporter",
  contributor: "§5Contributor",
  donor: "§2Donor",
  guest: "§7Guest",
  sponsor: "§cSponsor"
}

// We are upgrading our coding-style from now on :v
export class RankHandler {
  static set(playerId , rank) {
    system.run(() => {
      const player = world.getPlayers().find(player => player.id === playerId);
      if(!player) return;

      // remove old rank tag first to avoid stacking
      const oldTag = player.getTags().find(tag => tag.startsWith("essentialcc_prefix:"));
      if(oldTag) player.removeTag(oldTag);

      player.addTag(`essentialcc_prefix:${rank}`);
      player.chatNamePrefix = `§l${rank} §r`;
      this.update(playerId);
    })
  }

  static remove(playerId) {
    system.run(() => {
      const player = world.getPlayers().find(player => player.id === playerId);
      if(!player) return;

      const rankTag = player.getTags().find(tag => tag.includes("essentialcc_prefix:"));
      if(rankTag) {
        player.removeTag(rankTag)
      }
      player.chatNamePrefix = undefined;
      this.update(playerId)
    })
  }

  static update(playerId) {
    const player = world.getPlayers().find(player => player.id === playerId);
    if(!player) return;

    const rankTag = player.getTags().find(tag => tag.includes("essentialcc_prefix:"))?.split(":")[1];
    const teamTag = player.getTags().find(tag => tag.includes("bedrockteams_prefix:"))?.split(":")[1];

    if(rankTag) {
      player.chatNamePrefix = `§l${rankTag} §r`;
    } else {
      player.chatNamePrefix = undefined;
    }

    if(rankTag && teamTag) {
      player.nameTag = `§l§i[ ${rankTag} §i]\n${teamTag} ${player.name}`
    } else if(rankTag) {
      player.nameTag = `§l§i[ ${rankTag} §i]\n${player.name}`
    } else if(teamTag) {
      player.nameTag = `${teamTag} ${player.name}`
    } else {
      player.nameTag = player.name
    }
  }
}