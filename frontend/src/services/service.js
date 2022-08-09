import axios from '../api/axios';

class DataService {

  register(user) {
    return axios.post('/newUser', user);
  }

  newAccessRequest(id, reqType) {
    return axios.post('/newAccessRequest', null, {
      params: {
        id,
        reqType
      }
    });
  }

  newActivity(ownerid, name) {
    return axios.post('/newActivity', null, {
      params: {
        ownerid,
        name
      }
    });
  }

  login(user) {
    return axios.post('/userAuth', user);
  }

  getUser(id) {
    return axios.get('/getUser', {
      params: {
        id
      }
    });
  }

  getAllUsers(id) {
    return axios.get('/getAllUsers', {
      params: {
        id
      }
    });
  } 

  getAllUsersNonAdmin(id) {
    return axios.get('/getAllUsersNonAdmin', {
      params: {
        id
      }
    });
  } 

  getAllRequests() {
    return axios.get('/getAllRequests');
  } 

  getAllUserActivities(userid) {
    return axios.get('/getAllUserActivities', {
      params: {
        userid
      }
    });
  }

  getActivity(activityid) {
    return axios.get('/getActivity', {
      params: {
        activityid
      }
    });
  }

  getAllActivityUsers(ownerid, activityid) {
    return axios.get('/getAllActivityUsers', {
      params: {
        ownerid,
        activityid
      }
    });
  }

  deleteUser(id) {
    return axios.delete('/deleteUser', {
      params: {
        id
      }
    });
  }

  deleteRequest(id) {
    return axios.delete('/deleteRequest', {
      params: {
        id
      }
    });
  }

  //axios.put(url[, data[, config]])
  updateUserAccess(id, level) {
    return axios.put('/updateAccess', null, {
      params: {
        id,
        level
      }
    });
  }
}

export default new DataService();