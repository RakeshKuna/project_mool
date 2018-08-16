import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";


MlResolver.MlQueryResolver['findFilterCatalog'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args.moduleName) {
    var id= args._id;
    let response= MlFiltersCatalog.findOne({"_id":args.moduleName});
    return response;
  }
}
