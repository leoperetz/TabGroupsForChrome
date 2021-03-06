/**
 * Functions to save and load group & associated tab details within the browser's local storage
 */

function loadGroups() {
    var hugeStorage = new HugeStorageSync();
    hugeStorage.get("tab_groups", function(strLoadedGroups) {
        chrome.storage.sync.get(["active_group_name"], function(items) {
            if(items["active_group_name"]) {
                activeGroup.name = items["active_group_name"];
                $("#group_id_" + activeGroup.id.toString()).find(".group_name").val(activeGroup.name);
            } else {
                console.log("First launch...");
            }

            if(strLoadedGroups == "") {
                console.log("No saved tab groups found");
                return;
            }

            var loadedGroupsList = JSON.parse(strLoadedGroups);

            for(var i = 0; i < loadedGroupsList.length; i++) {
                var newGroup = createGroup();
                newGroup.name = loadedGroupsList[i].name;
                $("#group_id_" + newGroup.id.toString()).find(".group_name").val(newGroup.name);

                for(var j = 0; j < loadedGroupsList[i].tabs_list.length; j++) {
                    // Create tab in loaded group
                    var new_tab = new classTab();

                    new_tab.id = getNewIdForTab();
                    new_tab.id_chrome = -1;
                    new_tab.url = loadedGroupsList[i].tabs_list[j].url;
                    new_tab.title = loadedGroupsList[i].tabs_list[j].title;
                    new_tab.pinned = loadedGroupsList[i].tabs_list[j].pinned;
                    new_tab.icon = loadedGroupsList[i].tabs_list[j].icon;
                    new_tab.tab_group = -1;

                    // Add the tab (without opening it)
                    addTabToGroup(newGroup, new_tab);
                }
            }
        });
    });
}

function saveGroups(callback) {
    //chrome.storage.sync.clear(function() {
    var saveGroupsList = new Array();
    for(var i = 0; i < groupsList.length; i++) {
        // Save all groups except the active group
        if(groupsList[i].id != activeGroup.id) {
            saveGroupsList.push(groupsList[i]);
        }
    }
    // Save the name of the active group
    chrome.storage.sync.set({ "active_group_name": activeGroup.name });

    // Split the list of groups into 'chunks', and save them to local storage
    var hugeStorage = new HugeStorageSync();
    hugeStorage.set('tab_groups', JSON.stringify(saveGroupsList), callback);
    //chrome.storage.sync.set({"groups_list":storageSplit});
    //});
}
