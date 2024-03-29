import axios from '../api/axios';

class DataService {

  register(user) {
    return axios.post('/users/new', user);
  }

  getTeamSuggestionsWithGurobi(activityid) {
    return axios.get(`/activities/${activityid}/matchmaking`);
  }

  getTeamSuggestionsWithSwagger(data) {
    return axios.post('http://localhost:9090/swagger/api/matchmaking', data);
  }

  refreshActivityMemberNum(activityid, membernum) {
    return axios.put(`/activities/${activityid}/activityMembers/refresh`, null, {
      params: {
        membernum
      }
    });
  }

  refreshActivityMemberNumFromDB(activityid) {
    return axios.get(`/activities/${activityid}/activityMembers/refreshFromDB`);
  }

  newReview(reviewerId, reviewedId, activityId, 
            quality, collaboration, preference) {
    return axios.post('/reviews/new', null, {
      params: {
        reviewerId,
        reviewedId,
        activityId,
        quality, 
        collaboration, 
        preference
      }
    });
  }

  newAccessRequest(id, reqType) {
    return axios.post(`users/${id}/requests`, null, {
      params: {
        id,
        reqType
      }
    });
  }

  newPendingReviewRequest(reviewerid, reviewedid, activityid) {
    return axios.post('/pendingReviews/new', null, {
      params: {
        reviewerid,
        reviewedid,
        activityid
      }
    });
  }

  newActivity(ownerid, name) {
    return axios.post(`/activities/new`, null, {
      params: {
        ownerid,
        name
      }
    });
  }

  addActivityMember(userid, activityid) {
    return axios.post('/activityMembers/new', null, {
      params: {
        userid,
        activityid
      }
    });
  }

  login(user) {
    return axios.post('/users/userAuth', user);
  }

  getUser(id) {
    return axios.get(`/users/${id}`);
  }

  getAllUsers(id) {
    return axios.get(`/users/id!=${id}`);
  } 

  getAllUsersNonAdminNonMember(activityid) {
    return axios.get(`/activities/${activityid}/activityNonMembers`);
  } 

  getAllAccessRequests() {
    return axios.get('/requests/access');
  } 

  getAllPendingReviews() {
    return axios.get('/pendingReviews');
  }

  getActivityPendingReviews(activityid) {
    return axios.get(`/activities/${activityid}/pendingReviews`);
  }

  getActivityReviews(activityid) {
    return axios.get(`/activities/${activityid}/reviews`);
  }

  getAllReviewerReviews(reviewerid) {
    return axios.get(`/users/${reviewerid}/reviews`);
  }

  getAllUserActivities(userid) {
    return axios.get(`/users/${userid}/activities`);
  }

  getActivity(activityid) {
    return axios.get(`/activities/${activityid}`, {
      params: {
        activityid
      }
    });
  }

  getAllReviewerPendingReviews(reviewerid) {
    return axios.get(`/users/${reviewerid}/pendingReviews`);
  }

  getAllActivityUsers(ownerid, activityid) {
    return axios.get(`/activities/${activityid}/users`, {
      params: {
        ownerid
      }
    });
  }

  deleteUser(id) {
    return axios.delete(`/users/${id}`);
  }

  deleteRequest(id) {
    return axios.delete(`/requests/access/${id}`);
  }

  deleteActivity(activityid) {
    return axios.delete(`/activities/${activityid}`);
  }

  removeActivityMember(userid, activityid) {
    return axios.delete(`/activities/${activityid}/activityMembers/${userid}`);
  }

  //axios.put(url[, data[, config]])
  updateUserAccess(id, level) {
    return axios.put(`/users/${id}/access`, null, {
      params: {
        level
      }
    });
  }
}

export default new DataService();