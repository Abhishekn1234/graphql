import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      _id
      title
      status
      dueDate
    }
  }
`;

export const GET_TASK_BY_ID = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      _id
      title
      description
      status
      dueDate
    }
  }
`;

export const GET_TASKS_BY_STATUS = gql`
  query GetTasksByStatus($status: String!) {
    tasksByStatus(status: $status) {
      _id
      title
      status
      dueDate
    }
  }
`;


