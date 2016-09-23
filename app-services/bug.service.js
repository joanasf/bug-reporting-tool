(function () {
    'use strict';

    angular
        .module('app')
        .factory('BugService', BugService);

    BugService.$inject = ['$http'];
    function BugService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByTitle = GetByTitle;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/bugs').then(handleSuccess, handleError('Error getting all bugs'));
        }

        function GetById(id) {
            return $http.get('/api/bugs/' + id).then(handleSuccess, handleError('Error getting bug by id'));
        }

        function GetByBugname(title) {
            return $http.get('/api/bugs/' + username).then(handleSuccess, handleError('Error getting bug by title'));
        }

        function Create(bug) {
            return $http.post('/api/bugs', bug).then(handleSuccess, handleError('Error creating bug'));
        }

        function Update(bug) {
            return $http.put('/api/bugs/' + bug.id, bug).then(handleSuccess, handleError('Error updating bug'));
        }

        function Delete(id) {
            return $http.delete('/api/bugs/' + id).then(handleSuccess, handleError('Error deleting bug'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
