// SERVER CODE! DEFINE METEOR METHODS
import { Mongo } from "meteor/mongo";

export const ToDos = new Mongo.Collection("todos");

if (Meteor.isServer) {
  Meteor.publish('todos', function todosPublication() {
    return ToDos.find({ owner: this.userId });
  });
}


Meteor.methods({
  // adding a todo
  "todos.addToDo"(value) {
    if (!this.userId) {
      // userId, freebie from meteor
      throw new Meteor.Error(
        //convention: collection name + method name + error name
        "todos.addToDo.not-authorized",
        "You must log in to add todos"
      );
    }

    ToDos.insert({
      title: value,
      complete: false,
      owner: this.userId
    });
  },

  // toggling complete (update)
  "todos.toggleComplete"(item) {
    if (item.owner !== this.userId) {
      // userId, freebie from meteor
      throw new Meteor.Error(
        //convention: collection name + method name + error name
        "todos.toggleComplete.not-authorized",
        "You are not authorized to update todos for other users"
      );
    }

    ToDos.update(item._id, { $set: { complete: !item.complete } });
  },

  // remove a todo
  "todos.removeToDo"(item) {
    if (item.owner !== this.userId) {
      // userId, freebie from meteor
      throw new Meteor.Error(
        //convention: collection name + method name + error name
        "todos.removeToDo.not-authorized",
        "You are not authorized to delete todos for other users"
      );
    }

    ToDos.remove(item._id);
  },

  //remove all completed todos
  "todos.removeCompleted"(owner) {
    if (owner !== this.userId) {
      // userId, freebie from meteor
      throw new Meteor.Error(
        //convention: collection name + method name + error name
        "todos.removeToDo.not-authorized",
        "You are not authorized to delete todos for other users"
      );
    }
    ToDos.remove({ owner: this.userId, complete: true });
  }
});


