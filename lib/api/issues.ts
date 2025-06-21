import { Context } from 'koa';
import { respond } from './responses';
import { Issue } from '../models/issue';
import { Revision } from '../models/revision';

interface IssueMethods {
  get: (context: Context) => Promise<void>;
  create: (context: Context) => Promise<void>;
  listAll: (context: Context) => Promise<void>;
  update: (context: Context) => Promise<void>;
  getRevisions: (context: Context) => Promise<void>;
  compareRevisions: (context: Context) => Promise<void>;
}

interface IssueRequestBody {
  title: string;
  description: string;
}

interface Changes {
  [key: string]: { old: string; new: string };
}

export interface Errors {
  [key: string]: string;  // key is the field name, and value is the error message
}

const Issues: IssueMethods = {} as IssueMethods;

Issues.get = async (context: Context): Promise<void> => {
  const issue = await Issue.findByPk(context.params.id);
  respond.success(context, { issue });
};

Issues.create = async (context: Context): Promise<void> => {
  const { title, description }: IssueRequestBody = context.request.body as IssueRequestBody;
  const email = context.state.user.email;

  // Input validation
  if (!title || !description) {
    // Pass the error as an object of type Errors
    return respond.badRequest(context, {
      title: 'Title is required',
      description: 'Description is required',
    });
  }

  try {
    const newIssue = await Issue.create({
      title,
      description,
      created_by: email,
      updated_by: email,  // Pass updated_by as well
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

Issues.listAll = async (context: Context): Promise<void> => {
  try {
    const issues = await Issue.findAll();
    respond.success(context, issues);
  } catch (error) {
    respond.badRequest(context, error.message);
  }
};

Issues.update = async (context: Context): Promise<void> => {
  const { id } = context.params;
  const { title, description }: IssueRequestBody = context.request.body as IssueRequestBody;
  const email = context.state.user.email;

  if (!title || !description) {
    // Pass the error as an object of type Errors
    return respond.badRequest(context, {
      title: 'Title is required',
      description: 'Description is required',
    });
  }

  try {
    const issue = await Issue.findByPk(id);
    if (!issue) {
      return respond.notFound(context);
    }

    const changes: Changes = {};

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

Issues.getRevisions = async (context: Context): Promise<void> => {
  const { id } = context.params;

  try {
    // Fetch all revisions for the specified issue
    const revisions = await Revision.findAll({
      where: { issue_id: id },
      order: [['created_at', 'ASC']], // Sort revisions by creation time
    });

    if (!revisions || revisions.length === 0) {
      return respond.notFound(context);
    }

    respond.success(context, revisions);
  } catch (error) {
    respond.badRequest(context, error.message);
  }
};

Issues.compareRevisions = async (context: Context): Promise<void> => {
  const { id, fromRevId, toRevId } = context.params;

  try {
    // Ensure you use the correct query syntax
    const fromRev = await Revision.findOne({
      where: { issue_id: id, id: fromRevId },  // Correct query
    });

    const toRev = await Revision.findOne({
      where: { issue_id: id, id: toRevId },  // Correct query
    });

    if (!fromRev || !toRev) {
      return respond.notFound(context);
    }

    const changes: Changes = {};  // Logic to compare changes between revisions

    respond.success(context, {
      before: fromRev,
      after: toRev,
      changes,
    });
  } catch (error) {
    respond.badRequest(context, error.message);
  }
};


export default Issues;



/**
 * @swagger
 * tags:
 *   name: Issues
 *   description: API for managing issues
 */

/**
 * @swagger
 * /issues:
 *   post:
 *     summary: Create a new issue
 *     description: This endpoint allows you to create a new issue by providing the title and description.
 *     tags: [Issues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the issue
 *               description:
 *                 type: string
 *                 description: The description of the issue
 *     responses:
 *       201:
 *         description: Created issue successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The issue ID
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Bad request, invalid data
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /issues:
 *   get:
 *     summary: List all issues
 *     description: This endpoint retrieves all stored issues.
 *     tags: [Issues]
 *     responses:
 *       200:
 *         description: A list of all issues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /issues/{id}:
 *   put:
 *     summary: Update an existing issue
 *     description: This endpoint allows you to update an issue's title and description by specifying its ID.
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the issue to be updated
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the issue
 *               description:
 *                 type: string
 *                 description: The updated description of the issue
 *     responses:
 *       200:
 *         description: Updated issue successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Bad request, invalid data
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Issue not found
 */

/**
 * @swagger
 * /issues/{id}/revisions:
 *   get:
 *     summary: Get all revisions of a specific issue
 *     description: This endpoint returns all revisions of a particular issue based on its ID.
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the issue for which revisions are being fetched
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of revisions for the issue
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   issue_id:
 *                     type: integer
 *                   changes:
 *                     type: object
 *                     description: Changes made in the revision
 *                   updated_by:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Issue not found
 *       401:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /issues/{id}/revisions/compare/{fromRevId}/{toRevId}:
 *   get:
 *     summary: Compare two revisions of an issue
 *     description: This endpoint compares two revisions of a specific issue and shows the differences.
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the issue to compare revisions for
 *         schema:
 *           type: integer
 *       - in: path
 *         name: fromRevId
 *         required: true
 *         description: The ID of the first revision
 *         schema:
 *           type: integer
 *       - in: path
 *         name: toRevId
 *         required: true
 *         description: The ID of the second revision
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A comparison between the two revisions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 before:
 *                   type: object
 *                   description: The issue content before the changes
 *                 after:
 *                   type: object
 *                   description: The issue content after the changes
 *                 changes:
 *                   type: object
 *                   description: Summary of the differences
 *                 revisions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       changes:
 *                         type: object
 *                       updated_by:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Revision not found
 *       401:
 *         description: Unauthorized access
 */
