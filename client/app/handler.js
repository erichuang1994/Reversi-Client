// Copyright (c) 2015 Eric Huang.MIT license.


var app=angular.module('app',['ngAnimate']);
var ipc=require('electron').ipcRenderer;
var Game=require('./game')

app.controller('main',['$scope','$sce',handler]);

function handler($scope,$sce){
  $scope.error=false;
  $scope.count=false;
  $scope.flag={
    isLogin:false,
    isRoot:false,
    isStart:false,
    showOpenGamePannel:false
  };
  $scope.cmd={
    opengame:'',
    kickout:'',
    token:'',
    closegame:'',
    watch:''
  }
  $scope.userList=[]
  $scope.gameList=[]
  $scope.user={
    username:'',
    addr:'',
    password:''
  };

  $scope.currentNavigation='user';

  $scope.game=new Game();

  $scope.board=$scope.game.getBoard();

  // handler调用的sender方法
  // 当已经登录的时候自动附上token
  //
  var send=function(msg){
    if($scope.flag.isLogin){
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

  $scope.join=function(gamename){
    send("JOIN "+gamename);
  }
  $scope.ready=function(){
    if(!$scope.flag.isStart){
      send("READY");
    }
  }
  $scope.list=function(){
    $scope.currentNavigation="user";
    send("LIST");
  };

  $scope.kickOut=function(){
    if($scope.cmd.kickout!=''){
      send(["KICKOUT",$scope.cmd.kickout].join(" "));
    }
  };

  $scope.games=function(){
      $scope.currentNavigation="games";
      send("GAMES");
  };

  $scope.watch=function(gamename){
    if($scope.flag.isRoot){
      send(["WATCH",gamename].join(" "));
    }
  };

  $scope.closegame=function(){
    if($scope.flag.isRoot){
      send(["CLOSEGAME",$scope.cmd.closegame].join(" "));
    }
  };

  $scope.move=function(x,y){
    point=$scope.board[x][y]
    if((!point.isBlack)&&(!point.isWhite)){
      point.isBlack=true;
      send("MOVE "+[x,y].join(" "));
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
        $scope.token=cmd[1];
        $scope.flag.isLogin=true;
        $scope.flag.isRoot=true;
        $scope.list();
        $scope.$apply();
        break;
      case "LOGIN":
        if(cmd[1]=="SUCCESS"){
          $scope.token=cmd[2];
          $scope.flag.isLogin=true;
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
        // 更新一下 列表
        $scope.$apply();
        break;
      case "GAMES":
        temp=[];
        for(var i=1;i<cmd.length;i=i+2){
          temp.push({gamename:cmd[i],free:(cmd[i+1]=="free"),status:cmd[i+1]});
        }
        $scope.gameList=temp;
        // 更新一下 列表
        $scope.$apply();
        break;
      case "JOIN":
        if(cmd[1]=="SUCCESS"){
          console.log("JOIN SUCCESS");
        }
        break;
      case "OPENGAME":
        if(cmd[1]=="SUCCESS"){
          $scope.flag.showOpenGamePannel=false;
          $scope.$apply();
          console.log("OPENGAME SUCCESS");
        }
        break;
      case "START":
        console.log(typeof($scope.game));
        $scope.game.setting(cmd[1]);
        $scope.flag.isStart=true;
        $scope.game.start();
        $scope.$apply();
        console.log("START GAME")
        break;
      case "READY":
        if(cmd[1]=="SUCCESS"){
          console.log("READY SUCCESS");
        }else{
          console.log("READY FAIL");
        }
        break;
      case "CLOSE":
        if(cmd[2]=="SUCCESS"){
          send("GAMES");
        }
        break;
      case "MOVE":
        break;
      // default:
    }
  });
}
