## reversi



### protocol
- `Server`
	- msg:

		`MSG USERNAME MESSAGE ROOTTOKEN`
	- list:

		`LIST ROOTTOKEN`
	- kickout:

		`KICKOUT USERNAME ROOTTOKEN`
	- opengame:

		`OPENGAME GAMENAME ROOTTOKEN`
	- games:

		`GAMES Token`
	- watch:

		`WATCH GAMENAME ROOTTOKEN`

	- closegame:

		`CLOSEGAME GAMENAME ROOTTOKEN`
- `Client`
	- 空格分开
		- login:

			`LOGIN USERNAME`
		- games:

			`GAMES TOKEN`
		- list:

			`LIST TOKEN`
		- join:

			`JOIN GAMENAME TOKEN`
		- ready:

			`READY GAMENAME TOKEN`

		- move:

			`MOVE GAMENAME X Y TOKEN`

		- restart:

			`RESTART TOKEN`
		- restartreply:

			`RESTARTREPLY 1(YES)/0(NO) TOKEN`
		- leave:

			`LEAVE TOKEN`

### Server
-  Server使用golang

### Client
- client用nodejs(electron)
