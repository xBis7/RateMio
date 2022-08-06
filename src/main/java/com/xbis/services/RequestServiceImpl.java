package com.xbis.services;

import com.xbis.daos.RequestDAO;
import com.xbis.models.Request;
import com.xbis.models.ResponseRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service("requestService")
public class RequestServiceImpl implements RequestService {

  @Autowired
  RequestDAO requestDAO;

  @Override
  @Transactional
  public List<ResponseRequest> getAllRequests() {
    return requestDAO.getAllRequests();
  }

  @Override
  @Transactional
  public List<Request> getAllUserRequests(long userId) {
    return requestDAO.getAllUserRequests(userId);
  }

  @Override
  @Transactional
  public Request getRequest(long requestId) {
    return requestDAO.getRequest(requestId);
  }

  @Override
  @Transactional
  public Request addRequest(Request request) {
    return requestDAO.addRequest(request);
  }

  @Override
  @Transactional
  public boolean deleteRequest(long requestId) {
    return requestDAO.deleteRequest(requestId);
  }
}

