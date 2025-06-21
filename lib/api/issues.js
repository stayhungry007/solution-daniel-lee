"use strict";

const respond = require("./responses");
const Issue = require("../models/issue");
const Revision = require("../models/revision");

const baseUrl = "http://localhost:8080";

const Issues = {};

Issues.get = async (context) => {
  const issue = await Issue.findByPk(context.params.id);
  respond.success(context, { issue });
};

Issues.create = async (context) => {
  const { title, description } = context.request.body;
  const email = context.state.user.email;

  // Input validation
  if (!title || !description) {
    return respond.badRequest(context, "Title and description are required");
  }

  try {
    const newIssue = await Issue.create({
      title,
      description,
      created_by: email, // You'll replace this with the actual user
    });

    // Create a revision entry for the new issue
    await Revision.create({
      issue_id: newIssue.id,
      changes: { title: newIssue.title, description: newIssue.description },
      updated_by: email, // Replace with the actual user
    });

    respond.success(context, newIssue);
  } catch (error) {
    respond.badRequest(context, error.message);
  }
};

Issues.listAll = async (context) => {
  try {
    const issues = await Issue.findAll();
    respond.success(context, issues);
  } catch (error) {
    respond.badRequest(context, error.message);
  }
};

Issues.update = async (context) => {
  const { id } = context.params;
  const { title, description } = context.request.body;
  const email = context.state.user.email;

  if (!title || !description) {
    return respond.badRequest(context, "Title and description are required");
  }

  try {
    const issue = await Issue.findByPk(id);
    if (!issue) {
      return respond.notFound(context);
    }

    const changes = {};

    // Check for changes and track them
    if (issue.title !== title) {
      changes.title = { old: issue.title, new: title };
    }
    if (issue.description !== description) {
      changes.description = { old: issue.description, new: description };
    }

    if (Object.keys(changes).length > 0) {
      // Update the issue
      issue.title = title;
      issue.description = description;
      issue.updated_by = email; // Replace with the actual user
      await issue.save();

      // Create a revision entry for the changes
      await Revision.create({
        issue_id: issue.id,
        changes: changes,
        updated_by: email, // Replace with the actual user
      });
    }

    respond.success(context, issue);
  } catch (error) {
    respond.badRequest(context, error.message);
  }
};

Issues.getRevisions = async (context) => {
  const { id } = context.params;

  try {
      // Fetch all revisions for the specified issue
      const revisions = await Revision.findAll({
          where: { issue_id: id },
          order: [['created_at', 'ASC']],  // Sort revisions by creation time
      });

      if (!revisions || revisions.length === 0) {
          return respond.notFound(context);
      }

      respond.success(context, revisions);
  } catch (error) {
      respond.badRequest(context, error.message);
  }
};


module.exports = Issues;
