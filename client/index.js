/* global Firebase:true */

'use strict';

var root, users, battleships, myKey;

$(document).ready(init);

function init(){
  root = new Firebase('https://dicks-battleship.firebaseio.com/');
  users = root.child('users');
  battleships = root.child('battleships');
  $('#create-user').click(createUser);
  $('#login-user').click(loginUser);
  $('#logout-user').click(logoutUser);
  $('#start-user').click(startUser);
}

function logoutUser(){
  root.unauth();
  myKey = null;
  $('#characters > tbody > tr.active').removeClass('active');
}

function loginUser(){
  var email = $('#email').val();
  var password = $('#password').val();

  root.authWithPassword({
    email    : email,
    password : password
  }, function(error){
    if(error){
      console.log('Error logging in:', error);
    }
  });
}

function createUser(){
  var email = $('#email').val();
  var password = $('#password').val();

  root.createUser({
    email    : email,
    password : password
  }, function(error){
    if(error){
      console.log('Error creating user:', error);
    }
  });
}

function startUser(){
  var x = Math.floor(Math.random() * 10);
  var y = Math.floor(Math.random() * 10);
  battleships.child(myKey).update({x:x, y:y});
}

function characterAdded(snapshot){
  var character = snapshot.val();
  var myUid = root.getAuth() ? root.getAuth().uid : '';
  var active = '';

  if(myUid === character.uid){
    myKey = snapshot.key();
    myCharacter = snapshot.val();
    active = 'active';
  }

  var tr = '<tr class="'+active+'"><td>'+character.handle+'</td><td><img src="'+character.avatar+'"></td></tr>';
  $('#characters > tbody').append(tr);
}
