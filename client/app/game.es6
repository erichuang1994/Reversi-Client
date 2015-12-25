// Copyright (c) 2015 Eric Huang.MIT license.
// 14/12/2015

class Game{
  constructor(){
    this.pieces={black:1,white:0};
    // -1表示没有棋子在这个位置，0表示白棋，1表示黑棋
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
    // 来标识当前应该谁走了 0表示白棋，1表示黑棋
    this.turn=0;
    this.direction==[
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
  start(){
    this.board[3][3]=this.pieces.black;
    this.board[4][4]=this.pieces.black;
    this.board[3][4]=this.pieces.white;
    this.board[4][3]=this.pieces.white;
    this.isBegin=true;
  }
  restart(){
    for(var i=0;i<8;i++){
      for(var j=0;j<8;j++){
        this.board[i][j]=-1;
      }
    }
    start()
  }

  move(x,y,currentTurn){
    if(this.isBegin!=true){
      return
    }
    if(this.board[x][y]!=-1){
      return
    }
    flag=false;
    if(0<=x&&x<8&&0<=y&&y<8){
      for(var i=0;i<this.direction.length;i++){
        for(loc=this.add([x,y],this.direction);0<=loc[0]&&loc[0]<8&&0<=loc[1]&&loc[1]<8;loc=this.add(loc,this.direction)){
          if(this.board[loc[0]][loc[1]]==(currentTurn+1)%2){
            continue;
          }else if(this.getPoint(loc)==currentTurn){
            for(var temp=this.add([x,y],this.direction);!this.equalPoint(temp,loc);addInPlace(temp,this.direction)){
              this.board[temp[0]][temp[1]]=currentTurn;
              flag=true;
              // temp=[temp[0]+this.direction[0],temp[1]+this.direction[1]];
            }
          }
        }
      }
      if(flag==true)
        this.turn=this.turn+1;
    }
  }

  localMove(x,y){
    move(x,y,this.color)
  }
  // available(){
  //   for(var i=0;i<this.direction.length;i++){
  //     for()
  //   }
  // }

  getBoard(){
    return this.board;
  }

// 设定是黑方还是白方
  setting(color){
    this.color=this.pieces[color];
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
}

module.exports=Game;
