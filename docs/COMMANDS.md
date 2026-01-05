# Available Commands
Default commands namespace: `essentialcc`

# Non-Operator Commands
These commands are meant to be use by anyone with or without the permission level of a operator.
|NAME                 |ALIASES                |PARAMETERS              | DESCRIPTION                                                           |
|---------------------|-----------------------|------------------------|-----------------------------------------------------------------------|
|sethome              |                       |                        |Set your own home location                                             |
|home                 |                       |                        |Teleport to the location of your home                                  |
|setwarp              |                       |\<warp\>                |Set a warp location with your current location.                        |
|delwarp              |                       |\<warp\>                |Delete the specified warp                                              |
|warplist             |                       |                        |List all warps available.                                              |
|warp                 |                       |\<warp\>                |Teleport to the location of the specified warp                         |
|suicide              |                       |                        |Cause yourself to die instantly                                        |

## Operator/Admin Commands
These commands are meant to be use by operators and cannot be accessible by non-operators.
|NAME                      |ALIASES                |PARAMETERS                       | DESCRIPTION                                                           |
|--------------------------|-----------------------|---------------------------------|-----------------------------------------------------------------------|
|ban                       |                       |\<player\> [reason]              |Permanently ban a player from the server.                              |
|pardon                    |unban                  |\<player\>                       |Pardon a player that was banned from the server.                       |
|banlist                   |                       |                                 |List all the names of banned players.                                  |
|nickname                  |nick                   |\<player\> [nickname]            |Set a new nickname to a specifc player(s)                              |
|lockdimension             |                       |\<dimension\>                    |Lock a dimension to prevent players teleporting in this dimension.     |
|unlockdimension           |                       |\<dimensiom\>                    |Unlock a dimension to let players teleport to this dimension.          |
|kickall                   |                       |[reason] [includeOperators]      |Kick all players within the game except the issuer.                    |
|mute                      |                       |\<player\> [reason] [duration]   |Mute a player from chatting in the game.                               |
|unmute                    |                       |\<player\>                       |Unmute the player from sending chats in the game.                      |
|realname                  |                       |\<nickname\>                     |Show the real gamertag of the specified nickname.                      |