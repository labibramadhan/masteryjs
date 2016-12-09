import HttpStatus from 'http-status-codes';
import {
  assert,
} from 'chai';
import qs from 'qs';

const setup = require('../../../../../../test/helpers/setup');
const mockUsers = require('../../../../../../test/helpers/mock-users');

const prefix = conf.get('prefix');

describe(`GET count ${prefix}roles/count`, () => {
  before(async function before() {
    await setup();
    await mockUsers.bind(this).apply();
  });

  it('normal', async () => {
    const thisTestUrl = `${prefix}roles/count?${qs.stringify({
      where: {
        name: {
          $or: {
            $in: ['anonymous', 'admin'],
          },
        },
      },
    }).toString()}`;

    const {
      result,
      statusCode,
    } = await server.inject({
      url: thisTestUrl,
      method: 'GET',
      credentials: {
        scope: ['role:count'],
      },
    });

    assert.equal(statusCode, HttpStatus.OK);
    assert.equal(result.count, 2);
  });
});
