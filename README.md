# DiscordIdleRPG
Discord Bot for Discord's 2019 Hackweek

## How to set up

* Set up the MYSQL database. Create your database, then use this query to insert the table.
  - ```CREATE TABLE `users` (
    `id` int(20) NOT NULL AUTO_INCREMENT,
    `user` varchar(20) NOT NULL,
    `guild` varchar(20) NOT NULL,
    `creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `inventory` json DEFAULT NULL,
    `backpack` json DEFAULT NULL,
    `task` varchar(50) DEFAULT 'idle',
    `gold` double NOT NULL DEFAULT '0',
    `perks` json DEFAULT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;```
* Clone this repository (download)
* Set up secret.json in `/config/secret.json` in the project root.
  - Observe `secret_template.json`, and copy your token and db info in to it.
  - Rename the file `secret.json`
* Open terminal and navigate to the root directory of the project.
  - Type in `npm i`
  - Type in `node main`

