// Copyright (c) 2015 Eric Huang.MIT license.

'use strict';
var app=angular.module('app',['oitozero.ngSweetAlert']);
var ipc=require('electron').ipcRenderer;
var Game=require('./game')
app.controller('main',['$scope','SweetAlert',handler]);

function handler($scope,SweetAlert){
  $scope.error=false;
  $scope.count=false;
  $scope.flag={
    isLogin:false,
    isRoot:false,
    isStart:false,
    showOpenGamePannel:false,
    moveable:false,
    isJoin:false,
    showMessagePannel:false
  };
  $scope.cmd={
    opengame:'',
    kickout:'',
    token:'',
    closegame:'',
    watch:'',
    msg:{
      user:'',
      message:''
    }
  }
  $scope.gamename;
  $scope.userList=[];
  $scope.gameList=[];
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
  // SweetAlert.info({title:"",text:"水能载舟，亦可赛艇",timer:1000});

  $scope.login=function () {
      if(!$scope.user.username){
        return
      }
      var addr = $scope.user.addr || '127.0.0.1:3106';
      ipc.send('setting',addr);
      if($scope.user.password!=""){
        send("LOGIN "+[$scope.user.username,$scope.user.password].join(' '));
      }else{
        if($scope.user.username=="root"){
          SweetAlert.warning({title:"",text:"普通用户不能取这个名字"});
        }
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
  };

  $scope.ready=function(){
    console.log("ready test");
    if(!$scope.flag.isStart&&$scope.flag.isJoin){
      send("READY");
    }
  };

  $scope.restart=function(){
    if($scope.flag.isStart){
      send("RESTART");
    }else{
      SweetAlert.warning({title:"游戏还没开始呢",text:"太急了吧",timer:2000});
    }
  }
  $scope.list=function(){
    $scope.currentNavigation="user";
    send("LIST");
  };

  $scope.kickOut=function(username){
    if(username!=$scope.user.username){
      send(["KICKOUT",username].join(" "));
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
    if($scope.flag.moveable==true&&$scope.game.moveable(x,y)){
      send(["MOVE",$scope.gamename,x,y,$scope.game.color].join(" "));
      $scope.flag.moveable=false;
    }else{
      // 不能走的时候发出警告
      if($scope.flag.moveable==true){
      SweetAlert.warning({title:"这里不能下",text:"下棋也要按照基本法啊！",timer:2000});
    }else{
      SweetAlert.warning({title:"还没轮到你",text:"太急了吧",timer:2000});
    }
      return
    }
  };


  $scope.leave=function(){
    if($scope.flag.isJoin==true){
      $scope.reinit();
      $scope.game.setname("");
      $scope.flag.isJoin=false;
      $scope.$apply();
      send("LEAVE");
      SweetAlert.success({title:"",text:"离开成功",timer:2000});
    }
  };

  $scope.reinit=function(){
     $scope.flag.isStart=false;
     $scope.game.reinit();
  };

  $scope.message=function(){
    if($scope.flag.isRoot==true){
      if($scope.cmd.msg.message==""){
        SweetAlert.error({title:"",text:"消息不能为空"});
        return
      }
      $scope.flag.showMessagePannel=false;
      if($scope.cmd.msg.user==""){
        send("MSG "+$scope.cmd.msg.message);
      }else{
        send(["MSG",$scope.cmd.msg.user,$scope.cmd.msg.message].join(" "));
      }
    }
  };

  ipc.on('msg',function(event,message){
    var cmd=message.toString().trim().split(" ");
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
          SweetAlert.warning({title:"密码错误",text:"水能载舟，亦可赛艇",timer:2000});
        }
        break;
      case "LIST":
        var temp=[];
        for(var i=1;i<cmd.length;i=i+2){
          temp.push({username:cmd[i],free:(cmd[i+1]=="free"),status:cmd[i+1]});
        }
        $scope.userList=temp;
        // 更新一下 列表
        $scope.$apply();
        break;
      case "GAMES":
        var temp=[];
        for(var i=1;i<cmd.length;i=i+2){
          temp.push({gamename:cmd[i],free:(cmd[i+1]=="free"),status:cmd[i+1]});
        }
        $scope.gameList=temp;
        // 更新一下 列表
        $scope.$apply();
        break;
      case "JOIN":
        if(cmd[2]=="SUCCESS"){
          $scope.gamename=cmd[1];
          $scope.flag.isJoin=true;
          $scope.game.setname(cmd[1]);
          SweetAlert.success({title:"",text:"加入成功",timer:2000});
        }else{
          SweetAlert.success({title:"",text:"加入失败",timer:2000});
        }
        break;
      case "OPENGAME":
        if(cmd[1]=="SUCCESS"){
          $scope.flag.showOpenGamePannel=false;
          $scope.$apply();
          SweetAlert.success({title:"",text:"创建房间成功",timer:2000});
        }
        break;
      case "START":
        $scope.game.setting(cmd[1].toLowerCase());
        $scope.flag.isStart=true;
        $scope.game.start();
        $scope.$apply();
        SweetAlert.info({title:"",text:"游戏开始",timer:2000});
        break;
      case "RESTART":
        if(cmd[1]=="REQUEST"){
          SweetAlert.swal({
             title: "restart request",
             text: "对方请求重新开始游戏",
             type: "warning",
             showCancelButton: true,
             confirmButtonColor: "#DD6B55",confirmButtonText: "好的",
             cancelButtonText: "不",
             closeOnConfirm: false,
             closeOnCancel: false },
          function(isConfirm){
             if (isConfirm) {
                SweetAlert.swal("你同意了请求", "游戏将要重新开始", "success");
                $scope.restart();
             } else {
                SweetAlert.swal("你拒绝了请求", ":)", "error");
             }
          });
        }else if(cmd[1]=="SUCCESS"){
          $scope.game.reinit();
        }
        break;
      case "READY":
        if(cmd[1]=="SUCCESS"){
          console.log("READY SUCCESS");
        }else{
          console.log("READY FAIL");
        }
        break;
      case "LEAVE":
        SweetAlert.info({title:"",text:"玩家"+cmd[1]+"离开了游戏",timer:2000});
        $socpe.reinit();
        $scope.$apply();
        break;
      case "WATCH":
        if(cmd[1]=="SUCCESS"){
          $scope.flag.isJoin=true;
          $scope.game.start();
          $scope.game.setBoard(cmd[2]);
          $scope.$apply();
        }else if(cmd[1]=="FAIL"){
          SweetAlert.info({title:"",text:"游戏还没开始时不能观战"});
        }
        break;
      case "YOURTURN":
        $scope.flag.moveable=true;
        SweetAlert.info({title:"It's your turn.",text:"慢慢来,比较快.",timer:2000});
        // alert("轮你了")
        break;
      case "CLOSE":
        if($scope.flag.isRoot&&cmd[2]=="SUCCESS"){
          send("GAMES");
        }else{
          SweetAlert.info({title:"",text:"管理员关闭了房间",timer:2000});
          $scope.game.setname("");
          $scope.flag.isJoin=false;
          $scope.reinit();
          $scope.$apply();
        }
        break;
      case "RESULT":
        if(cmd[2]=="SUCCESS"){
          alert("Excited!");
        }else{
          alert("I'm angry!");
        }
        break;
      case "MOVE":
        $scope.game.move(parseInt(cmd[1]),parseInt(cmd[2]),cmd[3]);
        // 更新一下页面
        $scope.$apply();
        break;
      case "KICKOUT":
        if(cmd[1]==$scope.user.username){
          console.log("kickout here");
          SweetAlert.swal({
             title: "你被管理员踹出了房间",
             text: "年轻人不要作死",
             type: "warning",
             showCancelButton: false,
             confirmButtonColor: "#DD6B55",
             confirmButtonText: "确定",
             closeOnConfirm: true}
          );
          $scope.game.setname("");
          $scope.flag.isJoin=false;
          $scope.reinit();
          $scope.$apply();
        }else{
          SweetAlert.swal({
             title: "管理员信息",
             text: "用户"+cmd[1]+"被踢出了房间",
             type: "info",
             showCancelButton: false,
             confirmButtonColor: "#DD6B55",
             confirmButtonText: "确定",
             closeOnConfirm: false}
          );
          $scope.reinit();
          $scope.$apply();
        }
        break;
      case "GAMEOVER":
        // alert(cmd.join(" "));
        $scope.flag.isStart=false;
        SweetAlert.swal({
           title: "",
           text: cmd.join(" "),
           type: "info",
           showCancelButton: false,
           confirmButtonColor: "#DD6B55",
           confirmButtonText: "确定",
           closeOnConfirm: false}
         );
        break;
      case "MSG":
        SweetAlert.info({title:"管理员通知",text:cmd[1]});
        break;
      // default:
    }
  });
}
