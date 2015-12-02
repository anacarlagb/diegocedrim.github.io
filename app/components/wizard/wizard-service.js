var wizardModule = angular.module('wizardModule', []);

wizardModule.factory('WizardService', function() {
    return new WizardService();
});

function WizardService() {
    this.totalPages = null;
    this.currentPage = 1;

    this.hasNextPage = function(){
        return this.currentPage < this.totalPages;
    };

    this.hasPreviousPage = function(){
        return this.currentPage > 1;
    };

    this.setPage = function(page){
        return this.currentPage = page;
    };

    this.next = function() {
        this.currentPage++;
    }

    this.previous = function() {
        this.currentPage--;
    }
}