// Copyright (c) 2015 Eric Huang.MIT license.


var app=angular.module('app',['ngAnimate']);
var ipc=require('electron').ipcRenderer;
var Game=require('./game')

app.controller('main',['$scope','$sce',handler]);

function handler($scope,$sce){
  $scope.isLogin=false;
  $scope.error=false;
  $scope.token="";
  $scope.user={
    username:'',
    addr:'',
    password:''
  };
  console.log(typeof(Game));
  var game=new Game();
  $scope.game=game;
  $scope.game.start();
  $scope.board=$scope.game.getBoard();
  // $scope.board=[
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0]
  // ];
  // for(var i=0;i<8;i++){
  //   for(var j=0;j<8;j++){
  //     $scope.board[i][j]={isBlack:false,isWhite:false};
  //   }
  // }
  // $scope.board[3][3].isBlack=true;
  // $scope.board[4][4].isBlack=true;
  // $scope.board[3][4].isWhite=true;
  // $scope.board[4][3].isWhite=true;
  var send=function(msg){
    if($scope.isLogin){
      ipc.send('msg',msg+$scope.token);
    }else{
      ipc.send('msg',msg);
    }
  };
  $scope.login=function () {
      if(!$scope.user.username){
        return
      }
      var addr = $scope.user.addr || '127.0.0.1:3106';
      ipc.send('setting',addr);
      if($scope.user.password!=""){
        send("LOGIN "+[$scope.user.username,$scope.user.password].join(' '));
      }else{
        send("LOGIN "+$scope.user.username);
      }
  };
  $scope.move=function(x,y){
    point=$scope.board[x][y]
    if((!point.isBlack)&&(!point.isWhite)){
      point.isBlack=true;
      send("move:"+x+","+y);
      // console.log("move:"+x+","+y);
    }
  };
  ipc.on('msg',function(event,message){
    cmd=message.toString().split(" ");
    console.log(cmd)
    switch (cmd[0]) {
      case "LOGIN":
        if(cmd[1]=="SUCCESS"){
          $scope.token=cmd[2];
          $scope.isLogin=true;
          $scope.$apply();
        }
        else{
            alert("水能载舟，亦可赛艇");
        }
        break;
      // default:
    }
  });
}
