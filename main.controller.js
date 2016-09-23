(function () {
    'use strict';
    angular
    .module('app')
    .controller('MainController', MainController);

    MainController.$inject = ['BugService','UserService', '$location', '$rootScope', 'FlashService'];
    function MainController(BugService, UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];

        vm.bug = null;
        vm.allBugs = [];

        vm.selectedUser = null;
        vm.deleteUser = deleteUser;
        vm.trackBug = trackBug;        
        vm.deleteBug = deleteBug;

        vm.getUserName = getUserName;
        initController();
        
        function initController() {
            loadCurrentUser();
            loadAllUsers();
            loadAllBugs();
        }
        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
            .then(function (user) {
                vm.user = user;
                vm.selectedUser = user;
            });
        }
        function loadAllUsers() {
            UserService.GetAll()
            .then(function (users) {
                vm.allUsers = users;
            });
        }
        function deleteUser(id) {
            if (confirm("Are you sure you want to delete this user?")){
                UserService.Delete(id)
                .then(function () {
                    loadAllUsers();
                });
            }
        }
        function loadAllBugs() {
            BugService.GetAll()
            .then(function (bugs) {
                vm.allBugs = bugs;
            });
        }
        function deleteBug(id) {
            if (confirm("Are you sure you want to delete this bug?")){
                BugService.Delete(id)
                .then(function () {
                    loadAllBugs();
                });
            }
        }
        function trackBug() {
            vm.dataLoading = true;
            vm.bug.userId = vm.selectedUser.id;
            BugService.Create(vm.bug)
            .then(function (response) {
                if (response.success) {
                    FlashService.Success('Bug tracked successfully', true);
                    initController();
                    vm.bug.title = '';
                    vm.bug.description = '';
                    vm.dataLoading = false;
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
            
        }
        function getUserName(userId){
            var username;
            angular.forEach(vm.allUsers, function(value,key){
                if (value.id == userId){
                    username = value.username;
                }
            });
            return username;
        }
    }
})();
