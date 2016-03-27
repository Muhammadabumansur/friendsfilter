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
                    var friendsArray = response.response;
                    friendsArray.forEach(function(item, i) {
                        var li = document.createElement("li");
                        li.className = 'all_friends_list_item';
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
                        var friendAdd = document.createElement("div");
                        friendAdd.className = 'friend_add';
                        li.appendChild(friendAdd);
                        allFriendsList.appendChild(li);
                    });

                    var filteredFriendsArray = [];                    

                     friends.addEventListener('click', function (e) {
                        e.preventDefault();
                        if (e.target.className == "friend_add") {
                            var li =  e.target.closest('li');
                            filteredFriendsList.insertBefore(li, filteredFriendsList.children[0]);
                            li.className = "filtered_friends_list_item";
                            li.removeChild(e.target);
                            var friendRemove = document.createElement('div');
                            friendRemove.className = 'friend_remove';
                             li.appendChild(friendRemove);
                            friendsArray.forEach( function(item, i) {
                                if ('id' + item.uid == li.id) {
                                    filteredFriendsArray.splice(0, 0, item);
                                    friendsArray.splice(i, 1);
                                }
                            })

                        }

                        if (e.target.className == "friend_remove") {
                            var li =  e.target.closest('li');
                            allFriendsList.insertBefore(li, allFriendsList.children[0]);
                            li.className = "all_friends_list_item";
                            li.removeChild(e.target);
                            var friendAdd = document.createElement('div');
                            friendAdd.className = 'friend_add';
                            li.appendChild(friendAdd);
                            filteredFriendsArray.forEach( function(item, i) {
                                if ('id' + item.uid == li.id) {
                                    friendsArray.splice(0, 0, item);
                                    filteredFriendsArray.splice(i, 1);
                                }
                            })
                        }
                    });

                    search.addEventListener('input', function (e) {
                         if (e.target.className == "search_friends") {
                            var allResArray = [];
                            allResArray = friendsArray.filter(function (item) {
                                if (e.target.value) {
                                    console.log('left');
                                    return (item.first_name.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1) || (item.last_name.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1);
                                } else {
                                    return friendsArray;
                                }                 
                            });

                            allFriendsList.innerHTML = "";
                            allResArray.forEach( function(item, i) {
                                var li = document.createElement("li");
                                li.className = 'all_friends_list_item';
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
                                var friendAdd = document.createElement("div");
                                friendAdd.className = 'friend_add';
                                li.appendChild(friendAdd);
                                allFriendsList.appendChild(li);
                            });
                         }

                         if (e.target.className == "search_filtered_friends") {
                            var filteredResArray = [];
                            filteredResArray = filteredFriendsArray.filter(function (item) {
                                if (e.target.value) {
                                    return (item.first_name.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1) || (item.last_name.toLowerCase().indexOf(e.target.value.trim().toLowerCase()) !== -1);
                                } else {
                                    return filteredFriendsArray;
                                }                 
                            });

                            filteredFriendsList.innerHTML = "";
                            filteredResArray.forEach( function(item, i) {
                                var li = document.createElement("li");
                                li.className = 'filtered_friends_list_item';
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
                                var friendRemove = document.createElement("div");
                                friendRemove.className = 'friend_remove';
                                li.appendChild(friendRemove);
                                filteredFriendsList.appendChild(li);
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
                        filteredFriendsList.insertBefore(li, filteredFriendsList.children[0]);
                        li.className = "filtered_friends_list_item";
                        li.removeChild(li.getElementsByClassName('friend_add')[0]);
                        var friendRemove = document.createElement('div');
                        friendRemove.className = 'friend_remove';
                        li.appendChild(friendRemove);
                        friendsArray.forEach( function(item, i) {
                            if ('id' + item.uid == data) {
                                filteredFriendsArray.splice(0, 0, item);
                                friendsArray.splice(i, 1);
                            }
                        })                        
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
                        allFriendsList.insertBefore(li, allFriendsList.children[0]);
                        li.className = "all_friends_list_item";
                        li.removeChild(li.getElementsByClassName('friend_remove')[0]);
                        var friendAdd = document.createElement('div');
                        friendAdd.className = 'friend_add';
                        li.appendChild(friendAdd);
                        filteredFriendsArray.forEach( function(item, i) {
                            if ('id' + item.uid == data) {
                                friendsArray.splice(0, 0, item);
                                filteredFriendsArray.splice(i, 1);
                            }
                        })                        
                     })

                     allFriendsList.addEventListener('dragover', function (e) {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";                                                
                     }) 

                     saveFriends.addEventListener('click', function () {
                          /* body... */ 
                     })

                    resolve();

                }
            });
        })
    }).catch(function(e) {
    alert('Ошибка: ' + e.message);
});
