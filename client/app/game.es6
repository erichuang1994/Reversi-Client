// Copyright (c) 2015 Eric Huang.MIT license.
// 14/12/2015

class Game{
  constructor(){
    this.board=[
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ];
    for(var i=0;i<8;i++){
      for(var j=0;j<8;j++){
        this.board[i][j]={isBlack:false,isWhite:false};
      }
    }
  }
  start(){
    this.board[3][3].isBlack=true;
    this.board[4][4].isBlack=true;
    this.board[3][4].isWhite=true;
    this.board[4][3].isWhite=true;
  }
  restart(){
    for(var i=0;i<8;i++){
      for(var j=0;j<8;j++){
        this.board[i][j]={isBlack:false,isWhite:false};
      }
    }
    start()
  }
  getBoard(){
    return this.board;
  }
}

module.exports=Game;
