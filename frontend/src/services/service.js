import axios from '../api/axios';

class DataService {

  register(user) {
    return axios.post('/newUser', user);
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

  getAllUsers() {
    return axios.get('/getAllUsers');
  } 

  deleteUser(id) {
    return axios.delete('/deleteUser', {
      params: {
        id
      }
    });
  }

  updateUserAccess(id, level) {
    return axios.put('/updateAccess', {
      params: {
        id,
        level
      }
    });
  }

}

export default new DataService();