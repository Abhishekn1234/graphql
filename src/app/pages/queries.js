import { gql } from '@apollo/client';

export const ADD_TASK = gql`
  mutation AddTask($title: String!, $description: String!, $status: String!, $dueDate: String!) {
    addTask(title: $title, description: $description, status: $status, dueDate: $dueDate) {
      _id
      title
      status
      dueDate
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      _id
      status
    }
  }
`;
