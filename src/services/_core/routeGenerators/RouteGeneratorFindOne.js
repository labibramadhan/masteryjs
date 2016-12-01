const RouteGeneratorBaseGeneral = requireF('services/_core/routeGenerators/base/RouteGeneratorBaseGeneral');
const HandlerGeneratorFindOne = requireF('services/_core/handlerGenerators/HandlerGeneratorFindOne');

export default class RouteGeneratorFindOne extends RouteGeneratorBaseGeneral {
  constructor(model) {
    const methodName = 'findOne';
    const handlerGenerator = new HandlerGeneratorFindOne(model);

    super({
      handler: handlerGenerator.handler,
      methodName,
      model,
    });

    const singular = conf.get(`models:${model.name}:singular`) || model.name;

    this.method = 'GET';
    this.path = singular;
  }
}
