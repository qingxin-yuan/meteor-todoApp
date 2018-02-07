import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import "./styles.css";

import ToDoItem from "../../components/ToDoItem";
import ToDoCount from "../../components/ToDoCount";
import ClearButton from "../../components/ClearButton";

import { ToDos } from "../../../api/todos";

import AccountsUIWrapper from "../../components/AccountsUIWrapper";
import { Meteor } from "meteor/meteor";

class App extends Component {
  constructor() {
    super();

    this.addToDo = this.addToDo.bind(this);
    this.removeCompleted = this.removeCompleted.bind(this);
  }

  // toggle the checkbox to denote completion status
  toggleComplete(item) {
    //USE UPDATE METHOD
    //$SET

    Meteor.call("todos.toggleComplete", item);
  }

  // add a new to do to the list
  addToDo(event) {
    event.preventDefault(); // prevent refreshing the page

    if (this.toDoInput.value) {
      Meteor.call("todos.addToDo", this.toDoInput.value);

      this.toDoInput.value = "";
    }
  }

  // remove a to do from the list
  removeToDo(item) {
    //REMOVE METHOD
    //  console.log(item);

    Meteor.call("todos.removeToDo", item);
  }

  // remove all completed to dos from the list
  removeCompleted() {
    //REMOVE METHOD

    Meteor.call("todos.removeCompleted", this.props.currentUserId);
  }

  // check if any of the todos are completed
  hasCompleted() {
    let completed = this.props.todos.filter(todo => todo.complete);
    return completed.length > 0 ? true : false;
  }

  componentDidMount() {
    this.props.currentUserId && this.toDoInput.focus();
  }

  render() {
    let number = this.props.todos.length;

    const isLoggedIn = this.props.currentUserId;

    return (
      <div className="app-wrapper">
        <div className="login-wrapper">
          <AccountsUIWrapper />
        </div>
        <div className="todo-list">
          <h1>So Much To Do</h1>
          {isLoggedIn ? (
            <div>
              <div className="add-todo">
                <form name="addTodo" onSubmit={this.addToDo}>
                  <input type="text" ref={ref => (this.toDoInput = ref)} />
                  <span>(press enter to add) </span>
                </form>
              </div>
              <ul>
                {this.props.todos.map((todo, index) => (
                  <ToDoItem
                    key={index}
                    item={todo}
                    toggleComplete={this.toggleComplete.bind(this, todo)}
                    removeToDo={this.removeToDo.bind(this, todo)}
                  />
                ))}
              </ul>
              <div className="todo-admin">
                <ToDoCount number={number} />
                {this.hasCompleted() && (
                  <ClearButton removeCompleted={this.removeCompleted} />
                )}
              </div>
            </div>
          ) : (
            <div className="logged-out-message">
              <p>Please sign in to see your todos.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  todos: []
};

App.propTypes = {
  todos: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  currentUserId: PropTypes.string
};

export default withTracker(() => {
  Meteor.subscribe('todos'); 
  return {
    currentUser: Meteor.user(),
    currentUserId: Meteor.userId(),
    todos: ToDos.find({}).fetch()
  };
})(App);
