<template>
  <div>
    <todo-item
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @update-todo="updateTodo"
      @delete-todo="deleteTodo"
    />
    <hr>
    <todo-creator @create-todo="createTodo" />
  </div>
</template>

<script>
import lowdb from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage'
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import TodoCreator from './TodoCreator.vue';
import TodoItem from './TodoItem.vue';
export default {
 components: {
   TodoCreator,
   TodoItem
 },
 data() {
   return {
     db: null,
     todos: []
   }
 },
 created(){
   this.initDB();
 },
 methods: {
   initDB() {
     const adapter = new LocalStorage('todo-app');
     this.db = lowdb(adapter)

    const hasTodos = this.db.has('todos').value();

    if(hasTodos) {
      this.todos = _cloneDeep(this.db.getState().todos)
    }else{
      this.db
      .defaults({
       todos: []  //Collection
     })
      .write()
    }
   },
   createTodo (title) {
     const newTodo = {
       id: Math.round(Math.random()*1000),
       title,
       updatedAt: new Date(),
       createdAt: new Date(),
       done: false
     }

    //Create DB
     this.db
      .get('todos')  //lodash
      .push(newTodo) //lodash
      .write()  // lowdb

    //Create Client
      this.todos.push(newTodo);
   },
   updateTodo(todo,value){

     //Update DB
     this.db
      .get('todos')
      .find({id:todo.id})
      .assign(value)
      .write()

      //Update Client
     const foundTodo = _find(this.todos,{id:todo.id});
     _assign(foundTodo, value);
   },
   deleteTodo(){
     console.log("delete Todo")
   }
 },
}
</script>

<style>

</style>