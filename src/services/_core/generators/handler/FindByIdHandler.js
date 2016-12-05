const BaseHandler = requireF('services/_core/generators/handler/BaseHandler');

export default class FindByIdHandler extends BaseHandler {
  query = async (request, reply) => {
    const result = await this.model.findById(request.params.pk);
    return reply(result.toJSON());
  }
}
