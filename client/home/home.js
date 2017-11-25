(function () {

 let home = angular.module('mockpack.home', []);

 home.component('mockpackHome', {

   template: `
      <div>
        <span data-ng-repeat="word in $ctrl.wordchain track by $index">{{ word }} </span>
        <form class="word_form" data-ng-submit="$ctrl.create_word()">
          <input class="word_input" type="text" data-ng-model="$ctrl.word">
        </form>   
      </div>
   `,
   controller: function (io, $scope) {

     this.wordchain = [];

     this.word = '';

     this.$onInit = () => {

       this.socket = io.connect('/');

       this.socket.on('wordchain:list', (list) => {

         this.wordchain = list;
         $scope.$apply();

       });

     };

     this.create_word = () => {

       if(!this.socket) return;

       this.socket.emit('wordchain:create', this.word);

       this.word = '';

     };

   }

 });

 home.service('io', function($window){
   return $window.io;
 });

 window.addEventListener('DOMContentLoaded', function () {

   let container = document.querySelector('mockpack-home');

   angular.bootstrap(container, [ 'mockpack.home' ]);

 });

}());