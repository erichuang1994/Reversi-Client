// Copyright (c) 2015 Eric Huang.MIT license.
// 14/12/2015

class Game{
  constructor(){
    this.name="";
    this.pieces={black:0,white:1};
    // -1表示没有棋子在这个位置，0表示黑棋，1表示白棋
    this.board=[
      [-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1,-1,-1,-1]
    ];
    // 标识某个位置能不能走，只维护自己的（比如说自己是黑色就只维护黑色能走的地方)
    // update after every step
    this.matrix=[
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false]
    ]
    // 来标识当前应该谁走了 0表示黑棋，1表示白棋
    this.direction=[
      [1,0],
      [-1,0],
      [0,1],
      [0,-1],
      [1,1],
      [1,-1],
      [-1,1],
      [-1,-1]
    ];

    this.isBegin=false;

  }

  reinit(){
    for(var i=0;i<8;i++){
      for(var j=0;j<8;j++){
        this.board[i][j]=-1;
        this.matrix=false;
      }
    }
    this.color="";
    this.isBegin=false;
  }
  move(x,y,color){
    if(this.isBegin!=true){
      return
    }
    if(this.board[x][y]!=-1){
      return
    }
    // console.log("move %d %d",x,y);
    var currentTurn=this.pieces[color];
    this.board[x][y]=currentTurn;
    if(0<=x&&x<8&&0<=y&&y<8){
      for(var i=0;i<this.direction.length;i++){
        for(var loc=this.add([x,y],this.direction[i]);0<=loc[0]&&loc[0]<8&&0<=loc[1]&&loc[1]<8;loc=this.add(loc,this.direction[i])){
          // console.log("test (d,d) %d",loc[0],loc[1],this.getPoint(loc));
          if(this.getPoint(loc)==(currentTurn+1)%2){
            continue;
          }else if(this.getPoint(loc)==currentTurn){
            // console.log("起飞");
            for(var temp=this.add([x,y],this.direction[i]);!this.equalPoint(temp,loc);this.addInPlace(temp,this.direction[i])){
              this.board[temp[0]][temp[1]]=currentTurn;
            }
          }
          // console.log("fail (%d,%d)",loc[0],loc[1]);
          break
        }
      }
    }
    // 走完更新一下矩阵
    this.updateMatrix();
    this.showboard();
  }

  localMove(x,y){
    this.move(x,y,this.color)
  }

  moveable(x,y){
    return this.matrix[x][y]
  }
  // 测试某个位置能不能走
  testmove(x,y){
    if(!(0 <= x && x<8 && 0 <= y && y < 8) || this.board[x][y] != - 1){
      return false
    }
    var turn=this.pieces[this.color]
    for(var i=0;i<this.direction.length;i++){
      for(var loc=this.add([x,y],this.direction[i]);0<=loc[0]&&loc[0]<8&&0<=loc[1]&&loc[1]<8;this.addInPlace(loc,this.direction[i])){
        if(this.getPoint(loc)==(turn+1)%2){
          continue;
        }else if(this.getPoint(loc)==turn){
          for(var temp=this.add([x,y],this.direction[i]);!this.equalPoint(temp,loc);this.addInPlace(temp,this.direction[i])){
            return true
          }
        }
        break
      }
    }
    return false
  }
  updateMatrix(){
    for(var x=0;x<8;x++){
      for(var y=0;y<8;y++){
        this.matrix[x][y]=this.testmove(x,y);
      }
    }
  }

  getBoard(){
    return this.board;
  }
  // 用board来更新棋盘考虑到为了方便，从服务器返回棋盘时应将-1输出成3
  setBoard(boardstr){
    for(var x=0;x<8;x++)
      for(var y=0;y<8;y++){
        var temp=parseInt(boardstr[x*8+y]);
        if (temp==3){
          this.board[x][y]=-1;
        }else{
          this.board[x][y]=temp;
        }
      }
    this.updateMatrix();
  }
// 设定是黑方还是白方
  setting(color){
    this.color=color;
  }
// 二维向量相加
  add(x,y){
    return [x[0]+y[0],x[1]+y[1]]
  }
  // add in place
  addInPlace(x,y){
    x[0]+=y[0];
    x[1]+=y[1];
  }
  // 获取一点的颜色
  getPoint(x){
    return this.board[x[0]][x[1]]
  }
  // 比较两点坐标是否相等
  equalPoint(x,y){
    if(x[0]==y[0]&&x[1]==y[1]){
      return true
    }
    return false
  }
  setname(name){
    this.name=name;
  }
  start(){
    this.board[3][3]=this.pieces.black;
    this.board[4][4]=this.pieces.black;
    this.board[3][4]=this.pieces.white;
    this.board[4][3]=this.pieces.white;
    this.updateMatrix();
    this.isBegin=true;
  }
  restart(){
    for(var i=0;i<8;i++){
      for(var j=0;j<8;j++){
        this.board[i][j]=-1;
        this.matrix=false;
      }
    }
    this.start();
  }
  showboard(){
    console.log(this.board);
  }
}

module.exports=Game;
