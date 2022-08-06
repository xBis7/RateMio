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

  getAllRequests() {
    return axios.get('/getAllRequests');
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