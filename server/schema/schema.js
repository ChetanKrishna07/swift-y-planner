const Project = require("../models/Project.js");
const Task = require("../models/Task.js");
const User = require("../models/User.js");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

const { GraphQLDate } = require("graphql-iso-date");

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    skills: { type: GraphQLList(GraphQLString) },
  }),
});

// TaskType
const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    start_date: { type: GraphQLDate },
    end_date: { type: GraphQLDate },
    dependencies: {
      type: GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find({ _id: { $in: parent.dependencies } });
      },
    },
    skills: { type: GraphQLList(GraphQLString) },
    status: { type: GraphQLString },
  }),
});

// Project Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    team_members: {
      type: GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({ _id: { $in: parent.team_members } });
      },
    },
    task_list: {
      type: GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find({ _id: { $in: parent.task_list } });
      },
    },
    deadline: {
      type: GraphQLDate,
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
      type: GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    users: {
      type: GraphQLList(UserType),
      resolve(parent, args) {
        return User.find();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    tasks: {
      type: GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find();
      },
    },
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Task.findById(args.id);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        email: {
          type: GraphQLNonNull(GraphQLString),
        },
        skills: {
          type: GraphQLNonNull(GraphQLList(GraphQLString)),
        },
      },
      resolve(parent, args) {
        const user = new User({
          name: args.name,
          email: args.email,
          skills: args.skills,
        });
        return user.save();
      },
    },
    addTask: {
      type: TaskType,
      args: {
        title: {
          type: GraphQLNonNull(GraphQLString),
        },
        description: {
          type: GraphQLNonNull(GraphQLString),
        },
        start_date: {
          type: GraphQLNonNull(GraphQLDate),
        },
        end_date: {
          type: GraphQLNonNull(GraphQLDate),
        },
        dependencies: {
          type: GraphQLList(GraphQLID),
          defaultValue: [],
        },
        skills: {
          type: GraphQLNonNull(GraphQLList(GraphQLString)),
        },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              compelted: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
      },
      resolve(parent, args) {
        const task = new Task({
          title: args.title,
          description: args.description,
          start_date: args.start_date,
          end_date: args.end_date,
          dependencies: args.dependencies,
          skills: args.skills,
          status: args.status,
        });
        return task.save();
      },
    },
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        team_members: { type: GraphQLNonNull(GraphQLList(GraphQLID)) },
        task_list: { type: GraphQLNonNull(GraphQLList(GraphQLID)) },
        deadline: { type: GraphQLNonNull(GraphQLDate) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          team_members: args.team_members,
          task_list: args.task_list,
          deadline: args.deadline,
        });
        return project.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
