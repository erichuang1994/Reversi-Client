// Copyright (c) 2015 Eric Huang.MIT license.


var app=angular.module('app',['ngAnimate']);
var ipc=require('electron').ipcRenderer;
var Game=require('./game')

app.controller('main',['$scope','$sce',handler]);

function handler($scope,$sce){
  $scope.isLogin=false;
  $scope.isRoot=false;
  $scope.error=false;
  $scope.cmd={
    opengame:'',
    kickout:'',
    token:'',
    closegame:''
  }
  $scope.userList=[]
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
  var send=function(msg){
    if($scope.isLogin){
      ipc.send('msg',[msg,$scope.token].join(" "));
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

  $scope.openGame=function(){
    if($scope.cmd.opengame!=""){
      send("OPENGAME "+$scope.cmd.opengame);
    }
  };

  $scope.list=function(){
    send("LIST");
  };

  $scope.kickOut=function(){
    if($scope.cmd.kickout!=''){
      send(["KICKOUT",$scope.cmd.kickout].join(" "));
    }
  };

  $scope.games=function(){
      send("GAMES");
  };

  $scope.watch=function(){
    if($scope.isRoot){
      send(["WATCH",$scope.cmd.watch].join(" "));
    }
  };

  $scope.closegame=function(){
    if($scope.isRoot){
      send(["CLOSEGAME",$scope.cmd.closegame].join(" "));
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
    cmd=message.toString().trim().split(" ");
    console.log(cmd)
    switch (cmd[0]) {
      case "PING":
        send("PONG")
        break;
      case "ROOT":
        $scope.token=cmd[2];
        $scope.isLogin=true;
        $scope.isRoot=true;
        $scope.list();
        $scope.$apply();
        break;
      case "LOGIN":
        if(cmd[1]=="SUCCESS"){
          $scope.token=cmd[2];
          $scope.isLogin=true;
          $scope.list();
          $scope.$apply();
        }
        else{
            alert("水能载舟，亦可赛艇");
        }
        break;
      case "LIST":
        temp=[];
        for(var i=1;i<cmd.length;i=i+2){
          temp.push({username:cmd[i],free:(cmd[i+1]=="free"),status:cmd[i+1]});
        }
        $scope.userList=temp;
        // // console.log("LIST")
        // console.log("LIST:"+$scope.userList);
        break;
      // default:
    }
  });
}
