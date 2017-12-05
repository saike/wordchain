(function () {

 let home = angular.module('mockpack.home', []);

 home.component('mockpackHome', {

   template: `
      <div>
        <span data-ng-repeat="word in $ctrl.wordchain track by $index">{{ word.text }} </span>
        <form class="word_form" data-ng-submit="$ctrl.create_word()">
          <input data-ng-show="!$ctrl.busy" class="word_input" type="text" data-ng-model="$ctrl.word" data-ng-change="$ctrl.start_typing()">
          <span data-ng-show="$ctrl.busy">
            <span class="one">.</span><span class="two">.</span><span class="three">.</span>​
          </span>
        </form>   
      </div>
   `,
   controller: function (io, $scope, $window, $element) {

     this.wordchain = [];

     this.word = '';

     this.busy = false;

     this.$onInit = () => {

       let input = $element[0].querySelector('.word_input');

       input.focus();

       this.socket = io.connect('/');

       this.socket.on('wordchain:list', (list) => {

         this.wordchain = list;
         $scope.$apply();

       });

       this.socket.on('wordchain:typing:busy', (socket_id) => {

         if(this.socket.id !== socket_id) {

           this.busy = true;
           $scope.$apply();

         }

       });

       this.socket.on('wordchain:typing:idle', () => {

         this.busy = false;

         input.focus();

         $scope.$apply();

       });

     };

     this.create_word = () => {

       if(!this.socket) return;

       this.socket.emit('wordchain:create', this.word);

       this.word = '';

     };

     this.start_typing = () => {

       if(this.word.length > 0){

         this.socket.emit('wordchain:typing:start', this.word);

       }
       else {

         this.socket.emit('wordchain:typing:cancel', this.word);

       }

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