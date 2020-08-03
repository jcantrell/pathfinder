// test.js
class Bar {
       constructor() {
         this.user_name=null;
         this.user_surname=null;
         this.user_age=null;
       }

       name(user_name) {
         this.user_name=user_name;
         return this;
       }

       surname(user_surname) {
         this.user_surname=user_surname;
         return this;
       }

       age(user_age) {
         this.user_age=user_age;
         return this;
       }

       get(callback) {

         var list ={};

         list.uname=this.user_name;
         list.usurname=this.user_surname;
         list.uage=this.user_age;

         callback(list);
       }
}

module.exports = Bar
