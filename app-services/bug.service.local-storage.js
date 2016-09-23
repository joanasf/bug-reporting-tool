(function () {
    'use strict';

    angular
        .module('app')
        .factory('BugService', BugService);

    BugService.$inject = ['$timeout', '$filter', '$q'];
    function BugService($timeout, $filter, $q) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByTitle = GetByTitle
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve(getBugs());
            return deferred.promise;
        }

        function GetById(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getBugs(), { id: id });
            var bug = filtered.length ? filtered[0] : null;
            deferred.resolve(bug);
            return deferred.promise;
        }

        function GetByTitle(title) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getBugs(), { title: title });
            var bug = filtered.length ? filtered[0] : null;
            deferred.resolve(bug);
            return deferred.promise;
        }

        function Create(bug) {
            var deferred = $q.defer();

            // simulate api call with $timeout
            $timeout(function () {
                GetByTitle(bug.title)
                    .then(function (duplicateBug) {
                        if (duplicateBug !== null) {
                            deferred.resolve({ success: false, message: 'Title "' + bug.title + '" is already taken' });
                        } else {
                            var bugs = getBugs();

                            // assign id
                            var lastBug = bugs[bugs.length - 1] || { id: 0 };
                            bug.id = lastBug.id + 1;

                            // save to local storage
                            bugs.push(bug);
                            setBugs(bugs);

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function Update(bug) {
            var deferred = $q.defer();

            var bugs = getBugs();
            for (var i = 0; i < bugs.length; i++) {
                if (bugs[i].id === bug.id) {
                    bugs[i] = bug;
                    break;
                }
            }
            setBugs(bugs);
            deferred.resolve();

            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var bugs = getBugs();
            for (var i = 0; i < bugs.length; i++) {
                var bug = bugs[i];
                if (bug.id === id) {
                    bugs.splice(i, 1);
                    break;
                }
            }
            setBugs(bugs);
            deferred.resolve();

            return deferred.promise;
        }

        // private functions

        function getBugs() {
            if(!localStorage.bugs){
                localStorage.bugs = JSON.stringify([]);
            }

            return JSON.parse(localStorage.bugs);
        }

        function setBugs(bugs) {
            localStorage.bugs = JSON.stringify(bugs);
        }
    }
})();