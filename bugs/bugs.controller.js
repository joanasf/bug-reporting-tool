(function () {
    'use strict';

    angular
    .module('app')
    .controller('BugController', BugController);

    BugController.$inject = ['BugService','UserService', '$location', '$rootScope', 'FlashService'];
    function BugController(BugService, UserService, $location, $rootScope, FlashService) {
        var vm = this;


        vm.trackBug = trackBug;

        vm.bug = null;
        vm.bug.states = ["Open","Assigned","Closed"];
        /*vm.selectedState = 0;*/
        vm.bug.severity = ["Trivial", "Low", "Medium", "High", "Critical"];
        vm.allBugs = [];
        vm.deleteBug = deleteBug;

        initController();

        function initController() {
            loadAllBugs();
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
            BugService.Create(vm.bug)
            .then(function (response) {
                if (response.success) {
                    FlashService.Success('Bug tracked successfully', true);
                        initController();
                        vm.bug.title = '';
                        vm.bug.description = '';
                        <!--vm.bug.states = '';-->
                        vm.dataLoading = false;
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
            
        }
    }

})();
