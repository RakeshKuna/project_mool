import gql from "graphql-tag";
import { appClient } from "../../../../core/appConnection";

export async function fetchServiceByServiceId(serviceId, sessionId) {
  const result = await appClient.query({
    query: gql`
    query($serviceId:String){       
        findService(serviceId:$serviceId){
        finalAmount
      }
      }
    `,
    variables: {
      serviceId
    },
    fetchPolicy: 'network-only'
  });
  var response = result.data.findService;
  let service = _.omit(response, '__typename');
  service.duration = _.omit(service.duration, '__typename');
  service.payment = _.omit(service.payment, '__typename');
  service.facilitationCharge = _.omit(service.facilitationCharge, '__typename');
  let stateArray = [];
  _.each(service.state, (item, say) => {
    let value = _.omit(item, '__typename')
    stateArray.push(value);
  });
  service.state = stateArray;
  let cityArray = [];
  _.each(service.city, (item, say) => {
    let value = _.omit(item, '__typename')
    cityArray.push(value)
  });
  service.city = cityArray;
  let communityArray = [];
  _.each(service.community, (item, say) => {
    let value = _.omit(item, '__typename')
    communityArray.push(value)
  });
  service.community = communityArray;
  let taskArray = [];
  _.each(service.tasks, (item, say) => {
    let value = _.omit(item, '__typename');
    taskArray.push(value)
  });
  service.tasks = taskArray;
  if (service.tasks && service.tasks.length > 0) {
    let filterTask = service.tasks.find(function (data) {
      data.sessions = data.sessions ? data.sessions : [];
      return data.sessions.some(function (session) {
        return session.id == sessionId;
      });
    });
    service.tasks = filterTask;
  }
  return service
}
