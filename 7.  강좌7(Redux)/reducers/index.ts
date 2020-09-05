import { combineReducers } from 'redux';
import userReducer from './user';
import postReducer from './post';


const reudcer = combineReducers({
  user: userReducer,
  posts: postReducer,
})

export default reudcer;
