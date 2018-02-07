import { Meteor } from "meteor/meteor";
import {Accounts} from 'meteor/accounts-base';//for add default user

import { ToDos } from "../../api/todos";

Meteor.startup(() => {
 

  if (Meteor.users.find().count() ===0 ) {

    let userId = Accounts.createUser({
      email: "test@test.com",
      password: "password"
    })

  if (ToDos.find().count() === 0) {
      ToDos.insert({ title: "Learn Meteor Again", complete: false, owner: userId });
      ToDos.insert({ title: "Learn React Again", complete: false, owner: userId });
    }

  }


});
