'use strict';

const respond = require('./responses');
const Issue = require('../models/issue');

const baseUrl = 'http://localhost:8080';

const Issues = {};

Issues.get = async (context) => {
  const issue = await Issue.findByPk(context.params.id);
  respond.success(context, { issue });
};

Issues.create = async (context) => {
  const {title, description } = context.request.body;

  if(!title || !description) {
    return respond.badRequest(context, "Title and description are required")
  }

  try {
    const newIssue = await Issue.create({
      title,
      description,
      created_by: 'unknown',
    });

    respond.success(context, newIssue);
  } catch (error) {
    respond.badRequest(context, error.message);
  }
}

module.exports = Issues;
