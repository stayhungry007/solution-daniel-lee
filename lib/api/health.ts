import { Context } from 'koa';
import { respond } from './responses';

export default (context: Context): void => {
  respond.success(context, {
    message: 'OK',
    version: '1.0.0',
  });
};
