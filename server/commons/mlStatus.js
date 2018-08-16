
export default MlStatusRepo= class MlStatusRepo{

  static getStatusDefinition(code,module){
    var statusQuery={code:code};
    if(module){statusQuery.module=module};
    var status= MlStatus.findOne(statusQuery)||{};
    return status;
  }

  static updateStatus(request,code,module) {
    request = request || {};
    var status=MlStatusRepo.getStatusDefinition(code,module);
    request.status = status.code;
    request.statusDesc= status.description;
    return request;
  };

}

