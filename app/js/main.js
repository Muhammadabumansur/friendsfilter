new Promise(function(resolve) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
})
    .then(function() {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: 5379054
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    popup.style.opacity = 1;
                    logo.style.opacity = 1;
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, 2|4);
        });
    })
    .then(function() {

        closePopup.addEventListener('click', function (e) {
            e.preventDefault();
            popup.style.opacity = 0;
            logo.style.opacity = 0;
            VK.Auth.logout();
        });


        return new Promise(function(resolve, reject) {
            VK.api('friends.get', {'fields' : 'first_name, last_name, photo_50'}, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    var allFriendsArray = [];
                    var filteredFriendsArray = [];

                    function renderFriends(friendStatus, item) {
                        var li = document.createElement("li");
                        li.id = "id" + item.uid;
                        li.setAttribute('draggable', true);
                        var friendPhoto = document.createElement("img");
                        friendPhoto.className = 'friend_photo';
                        friendPhoto.setAttribute('src', item.photo_50);
                        friendPhoto.setAttribute('draggable', false);
                        li.appendChild(friendPhoto);
                        var friendName = document.createElement("div");
                        friendName.className = 'friend_name';
                        friendName.textContent = item.first_name + " " + item.last_name;
                        li.appendChild(friendName);
                        var friendMove = document.createElement("div");
                        if (friendStatus === "all") {
                                 li.className = 'all_friends_list_item';
                                 friendMove.className = 'friend_add';
                                 li.appendChild(friendMove);
                                allFriendsList.appendChild(li); 
                       } 
                       if (friendStatus === "filtered") {
                                li.className = 'filtered_friends_list_item';
                                friendMove.className = 'friend_remove';
                                li.appendChild(friendMove);
                                 filteredFriendsList.appendChild(li); 
                       }
                               
                    }

                    function moveFriend(friendsList, friendsArray, otherArray, li) {
                            friendsList.insertBefore(li, friendsList.children[0]);
                            li.className = "all_friends_list_item";
                            var friendMove = document.createElement('div');
                            if (friendsList === allFriendsList) {
                                    li.className = "all_friends_list_item";
                                    li.removeChild(li.getElementsByClassName('friend_remove')[0]);;
                                    friendMove.className = 'friend_add';
                            }
                            if (friendsList === filteredFriendsList) {
                                    li.className = "filtered_friends_list_item";
                                    li.removeChild(li.getElementsByClassName('friend_add')[0]);;
                                    friendMove.className = 'friend_remove';
                            }
                            li.appendChild(friendMove);
                            friendsArray.forEach(function(item, i) {
                                    if ('id' + item.uid == li.id) {
                                            otherArray.splice(0, 0, item);
                                            friendsArray.splice(i, 1);
                                    }
                            })
                    }

                    if (localStorage.allFriendsArray) {
                        allFriendsArray = JSON.parse(localStorage.allFriendsArray);
                        } else {
                            allFriendsArray = response.response;
                        }
                    if (localStorage.filteredFriendsArray) {
                        filteredFriendsArray = JSON.parse(localStorage.filteredFriendsArray);
                    }  else {
                        filteredFriendsArray = [];
                    }
                    allFriendsArray.forEach(function(item) {
                       renderFriends('all', item);
                    });

                     filteredFriendsArray.forEach(function(item) {
                        renderFriends('filtered', item);
                    });

                     friends.addEventListener('click', function (e) {
                        e.preventDefault();
                        if (e.target.className == "friend_add") {
                            var li =  e.target.closest('li');
                            moveFriend(filteredFriendsList, allFriendsArray, filteredFriendsArray, li);
                        }

                        if (e.target.className == "friend_remove") {
                            var li =  e.target.closest('li');
                            moveFriend(allFriendsList, filteredFriendsArray, allFriendsArray, li);
                        }
                    });

                    search.addEventListener('input', function (e) {
                         if (e.target.className == "search_friends") {
                            var allResArray = [];
                            allResArray = allFriendsArray.filter(function (item) {
                                if (e.target.value) {
                                    return ((item.first_name.toLowerCase()+" "+item.last_name.toLowerCase()).indexOf(e.target.value.trim().toLowerCase()) !== -1);
                                } else {
                                    return allFriendsArray;
                                }                 
                            });

                            allFriendsList.innerHTML = "";
                            allResArray.forEach( function(item) {
                               renderFriends('all', item);
                            });
                         }

                         if (e.target.className == "search_filtered_friends") {
                            var filteredResArray = [];
                            filteredResArray = filteredFriendsArray.filter(function (item) {
                                if (e.target.value) {
                                    return ((item.first_name.toLowerCase()+" "+item.last_name.toLowerCase()).indexOf(e.target.value.trim().toLowerCase()) !== -1);
                                } else {
                                    return filteredFriendsArray;
                                }                 
                            });

                            filteredFriendsList.innerHTML = "";
                            filteredResArray.forEach( function(item) {
                                renderFriends('filtered', item);
                            });
                         }

                    })

                     allFriendsList.addEventListener('dragstart', function (e) {
                        if (e.target.className == 'all_friends_list_item') {
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", e.target.id);                            
                          }
                     })

                     filteredFriendsList.addEventListener('drop', function (e) {
                        e.preventDefault();
                        var data = e.dataTransfer.getData("text");
                        var li = document.getElementById(data);
                        moveFriend(filteredFriendsList, allFriendsArray, filteredFriendsArray, li);
                     })

                     filteredFriendsList.addEventListener('dragover', function (e) {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";                                                
                     }) 


                     filteredFriendsList.addEventListener('dragstart', function (e) {
                        if (e.target.className == 'filtered_friends_list_item') {
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", e.target.id);                            
                          }
                     })

                     allFriendsList.addEventListener('drop', function (e) {
                        e.preventDefault();
                        var data = e.dataTransfer.getData("text");
                        var li = document.getElementById(data);
                        moveFriend(allFriendsList, filteredFriendsArray, allFriendsArray, li);
                     })

                     allFriendsList.addEventListener('dragover', function (e) {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";                                                
                     }) 

                     saveFriends.addEventListener('click', function () {
                        localStorage.setItem('allFriendsArray', JSON.stringify(allFriendsArray));
                        localStorage.setItem('filteredFriendsArray', JSON.stringify(filteredFriendsArray));
                     })

                    resolve();

                }
            });
        })
    }).catch(function(e) {
    alert('Ошибка: ' + e.message);
});
