import _ from 'lodash';

const {
  concatToJoiObject,
  getAllModels,
} = requireF('services/_core/commonServices');

const RequestValidatorConstants = requireF('services/_core/requestValidators/RequestValidatorConstants');
const RequestValidatorWhere = requireF('services/_core/requestValidators/RequestValidatorWhere');
const RequestValidatorInclude = requireF('services/_core/requestValidators/RequestValidatorInclude');
const RequestValidatorOrder = requireF('services/_core/requestValidators/RequestValidatorOrder');
const RequestValidatorPayload = requireF('services/_core/requestValidators/RequestValidatorPayload');
const RequestValidatorLimit = requireF('services/_core/requestValidators/RequestValidatorLimit');
const RequestValidatorOffset = requireF('services/_core/requestValidators/RequestValidatorOffset');
const RequestValidatorToken = requireF('services/_core/requestValidators/RequestValidatorToken');

export default class RequestValidators {
  constructor(model) {
    this.models = getAllModels();
    this.model = model;
    this.requestValidatorWhere = new RequestValidatorWhere();
    this.requestValidatorInclude = new RequestValidatorInclude(this.models);
    this.requestValidatorOrder = new RequestValidatorOrder(this.models, this.model);
    this.requestValidatorPayload = new RequestValidatorPayload();
    this.requestValidatorLimit = new RequestValidatorLimit();
    this.requestValidatorOffset = new RequestValidatorOffset();
    this.requestValidatorToken = new RequestValidatorToken();
  }
  build() {
    const self = this;
    const {
      model,
      models,
      requestValidatorWhere,
      requestValidatorInclude,
      requestValidatorOrder,
      requestValidatorPayload,
      requestValidatorLimit,
      requestValidatorOffset,
      requestValidatorToken,
    } = self;
    const {
      APPLICABLE_METHODS,
    } = RequestValidatorConstants;

    _.each(APPLICABLE_METHODS, (methods, sourceMethod) => {
      let validators = {};

      const hasWhere = APPLICABLE_METHODS[sourceMethod].includes('where');
      const hasInclude = APPLICABLE_METHODS[sourceMethod].includes('include');
      const hasOrder = APPLICABLE_METHODS[sourceMethod].includes('order');
      const hasPayload = APPLICABLE_METHODS[sourceMethod].includes('payload');
      const hasLimit = APPLICABLE_METHODS[sourceMethod].includes('limit');
      const hasOffset = APPLICABLE_METHODS[sourceMethod].includes('offset');

      if (hasWhere) {
        const whereValidation = concatToJoiObject(
          requestValidatorWhere.build(model),
          _.get(validators, 'query'),
        );
        validators = _.set(validators, 'query', whereValidation);
      }

      if (hasInclude) {
        const includeValidation = concatToJoiObject(
          requestValidatorInclude.build(models),
          _.get(validators, 'query'),
        );
        validators = _.set(validators, 'query', includeValidation);
      }

      if (hasOrder) {
        const orderValidation = concatToJoiObject(
          requestValidatorOrder.build(),
          _.get(validators, 'query'),
        );
        validators = _.set(validators, 'query', orderValidation);
      }

      if (hasPayload) {
        const payloadValidation = concatToJoiObject(
          requestValidatorPayload.build(model),
          _.get(validators, 'payload'),
        );
        validators = _.set(validators, 'payload', payloadValidation);
      }

      if (hasLimit) {
        const limitValidation = concatToJoiObject(
          requestValidatorLimit.build(),
          _.get(validators, 'query'),
        );
        validators = _.set(validators, 'query', limitValidation);
      }

      if (hasOffset) {
        const offsetValidation = concatToJoiObject(
          requestValidatorOffset.build(),
          _.get(validators, 'query'),
        );
        validators = _.set(validators, 'query', offsetValidation);
      }

      const tokenValidation = concatToJoiObject(
        requestValidatorToken.build(),
        _.get(validators, 'query'),
      );
      validators = _.set(validators, 'query', tokenValidation);

      self[sourceMethod] = validators;
    });
  }
}
