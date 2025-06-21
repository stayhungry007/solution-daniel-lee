import { Context } from 'koa';

export interface Errors {
  [key: string]: string;  // key is the field name, and value is the error message
}

export const respond = {
  badRequest: (context: any, errors: Errors): void => {
    context.body = {
      message: 'Check your request parameters',
      errors: errors,
    };
    context.status = 400;
  },

  success: (context: any, data: any): void => {
    context.body = data;
    context.status = data ? 200 : 204;
  },

  notFound: (context: any): void => {
    context.body = { message: 'Resource was not found' };
    context.status = 404;
  },
};
