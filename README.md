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

## TODO

Commands
  * Items
    - iteminfo (COMPLETE)
  * Shop
    - shop: Lists all items currently being sold, next and last as indicators to go back and forward. close to cancel. (COMPLETE)
    - buy: arg 1 is item by name. adds it to users inventory object  (COMPLETE)
    - sell: arg 1 is item by name. check user inventory. confirmation message afterwards. y/n  (COMPLETE)
    - pricecheck: arg 1 is item  (COMPLETE)
  * Inventory
    - view: lists all items in inventory in embed. next to view next page. close to cancel (COMPLETE)
    - drop: arg 1 is item by name, drops it from inventory. arg 2 is amount of items to drop. (COMPLETE)
  * Tasks
    - dungeon (COMPLETE)
    - dungeoninfo (COMPLETE)
    - dungeonlist (COMPLETE)
    - fish (COMPLETE)
    - mine (COMPLETE)
    - woodcutting (COMPLETE)
  * Player info
    - info: Lists all player info (COMPLETE)
    
