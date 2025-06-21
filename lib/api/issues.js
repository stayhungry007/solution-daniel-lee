'use strict';

const respond = require('./responses');
const Issue = require('../models/issue');
const issue = require('../models/issue');

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

Issues.listAll = async (context) => {
  try {
    const issues = await Issue.findAll();
    respond.success(context, issue);
  } catch (error) {
    respond.badRequest(context, error.message);
  }
}

Issues.update = async (context) => {
  const { id } = context.params;
  const { title, description } = context.request.body;

  if (!title || !description) {
    return respond.badRequest(context, 'Title and description are required');
  }

  try {
    const issue = await Issue.findByPk(id);
    if(!issue) {
      return respond.notFound(context);
    }

    issue.title = title;
    issue.description = description;
    issue.updated_by = 'unknown';

    await issue.save();

    respond.success(context, issue);
  } catch (error) {
    respond.badRequest(context, error.message);
  }
}

module.exports = Issues;
