## reversi

- 游戏运行逻辑(合法性，当前轮到谁走)交由server处理，客户端预先处理掉非法的步子，并且总是在收到服务器允许走的指令之后才走

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
	- yourturn:

		`YOURTURN ` 告知客户端轮到他走了
	- move:

		`MOVE X Y COLOR ROOTTOKEN`标示出是什么颜色
	- start:

		`START COLOR`
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

			`READY  TOKEN`

		- move:

			`MOVE GAMENAME X Y COLOR TOKEN`

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
