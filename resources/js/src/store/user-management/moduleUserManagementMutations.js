/*=========================================================================================
  File Name: moduleCalendarMutations.js
  Description: Calendar Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
  ==========================================================================================*/

export default {
    ADD_USER(state, item) {
        // state.products.unshift(item)
        state.users.unshift(item);
    },

    BLOCK_USER(state, item) {
        const userIndex = state.users.findIndex(u => u.id === item.id);
        // state.blocked_users.unshift(item)
        state.users.splice(userIndex, 1, item);
    },
    RESTORE_USER(state, item) {
        const userIndex = state.users.findIndex(u => u.id === item.id);
        // state.blocked_users.unshift(item)
        state.users.splice(userIndex, 1, item);
    },
    DELETE_USER(state, itemId) {
        const userIndex = state.users.findIndex(u => u.id === itemId);
        state.users.splice(userIndex, 1);
    },
    REMOVE_RECORD(state, itemId) {
        const userIndex = state.users.findIndex(u => u.id === itemId);
        state.users.splice(userIndex, 1);
    },
    UPDATE_ROLE(state, item) {
        // state.products.unshift(item)
        let index;
        index = state.roles.findIndex(element => {
            return element.id == item.id;
        });
        Object.assign(state.roles[index], item);
        // state.roles.splice(index, 1, item)
        // console.log("item::", state.roles[index])
    },
    UPDATE_PERMISSION(state, item) {
        // state.products.unshift(item)
        let index;
        index = state.permissions.findIndex(element => {
            return element.id == item.id;
        });
        Object.assign(state.permissions[index], item);
    },
    DELETE_PERMISSION(state, item) {
        // state.products.unshift(item)
        var index;
        index = state.permissions.findIndex(element => {
            return element.id == item;
        });
        state.permissions.splice(index, 1);
    },
    DELETE_ROLE(state, item) {
        // state.products.unshift(item)
        var index;
        index = state.roles.findIndex(element => {
            return element.id == item;
        });
        state.roles.splice(index, 1);
    },
    ADD_ROLE(state, item) {
        // state.products.unshift(item)
        state.roles.unshift(item);
    },
    ADD_PERMISSIONS(state, item) {
        // state.products.unshift(item)
        state.permissions.unshift(item);
    },
    SET_ROUTES(state, routes) {
        state.routes = routes;
    },
    SET_PERMISSIONS(state, permissions) {
        state.permissions = permissions;
    },
    SET_ROLES(state, roles) {
        state.roles = roles;
        state.roles_has_set = true;
    },
    SET_USERS(state, users) {
        state.users = users;
    },
    SET_USER(state, userId) {
        // console.log("COMMIT userId ====>>> ", userId)
        state.current_user = state.users.find(user => user.id == userId);
    },

    UPDATE_USER(state, user_to_store) {
        const userIndex = state.users.findIndex(u => u.id === user_to_store.id);
        state.users.splice(userIndex, 1, user_to_store);
    },

    UPDATE_USER_ROLES(state , user){
        const userIndex = state.users.findIndex(u => u.id === user.id);
        state.users.splice(userIndex, 1, user);

    }
};
