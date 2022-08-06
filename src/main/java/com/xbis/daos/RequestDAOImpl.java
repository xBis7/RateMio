package com.xbis.daos;

import com.xbis.models.Request;
import com.xbis.models.ResponseRequest;
import com.xbis.models.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.LinkedList;
import java.util.List;

@Repository
public class RequestDAOImpl implements RequestDAO {

  @Autowired
  private SessionFactory sessionFactory;

  public void setSessionFactory(SessionFactory sessionFactory){
    this.sessionFactory = sessionFactory;
  }

  public Session getSession() {
    return sessionFactory.openSession();
  }

  @Override
  public List<ResponseRequest> getAllRequests() {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT r FROM Request r";
    Query query = session.createQuery(sqlQuery);
    List <Request> requestList = query.getResultList();

    // this is like a hashmap and we need just the values
    //[{"requestid":<?>,"userid":<?>,"type":<?>}]
    List <ResponseRequest> responseRequestList = new LinkedList<>();

    for (Request request: requestList) {
      ResponseRequest responseRequest =
          new ResponseRequest(request.getRequestId(),
                              request.getUser().getUserid(),
                              request.getReqType());
      responseRequestList.add(responseRequest);
    }
    return responseRequestList;
  }

  @Override
  public List<Request> getAllUserRequests(long userId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT r FROM Request r WHERE r.userid = :userid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("userid", userId);
    List<Request> list = query.getResultList();
    return list;
  }

  @Override
  public Request getRequest(long requestId) {
    Session session = this.sessionFactory.getCurrentSession();
    Request request = (Request) session.get(Request.class, requestId);
    return request;
  }

  @Override
  public Request addRequest(Request request) {
    Session session = this.sessionFactory.getCurrentSession();
    session.persist(request);
    return request;
  }

  @Override
  public boolean deleteRequest(long requestId) {
    Session session = this.sessionFactory.getCurrentSession();
    Object persistentIns = session.load(Request.class, requestId);
    if (persistentIns != null) {
      session.delete(persistentIns);
      return true;
    }
    return false;
  }
}
