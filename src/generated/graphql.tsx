import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  addCollaborator?: Maybe<Scalars['Boolean']['output']>;
  createScript?: Maybe<Script>;
  createScriptVersion?: Maybe<ScriptVersion>;
  createUser?: Maybe<User>;
  deleteScript?: Maybe<Scalars['Boolean']['output']>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  removeCollaborator?: Maybe<Scalars['Boolean']['output']>;
  updateScript?: Maybe<Script>;
};


export type MutationAddCollaboratorArgs = {
  email: Scalars['String']['input'];
  scriptid: Scalars['ID']['input'];
};


export type MutationCreateScriptArgs = {
  title: Scalars['String']['input'];
  userid: Scalars['ID']['input'];
};


export type MutationCreateScriptVersionArgs = {
  scriptid: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationDeleteScriptArgs = {
  scriptid: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  userid: Scalars['ID']['input'];
};


export type MutationRemoveCollaboratorArgs = {
  email: Scalars['ID']['input'];
  scriptid: Scalars['ID']['input'];
};


export type MutationUpdateScriptArgs = {
  scriptid: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getAllSharedScripts?: Maybe<Array<Maybe<Script>>>;
  getAllUserScripts?: Maybe<Array<Maybe<Script>>>;
  getAllUsers?: Maybe<Array<Maybe<User>>>;
  getScriptVersions?: Maybe<Array<Maybe<ScriptVersion>>>;
  login?: Maybe<User>;
};


export type QueryGetAllSharedScriptsArgs = {
  userid: Scalars['ID']['input'];
};


export type QueryGetAllUserScriptsArgs = {
  userid: Scalars['ID']['input'];
};


export type QueryGetScriptVersionsArgs = {
  scriptid: Scalars['ID']['input'];
};


export type QueryLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Script = {
  __typename?: 'Script';
  last_modified: Scalars['String']['output'];
  scriptid: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  userid: Scalars['ID']['output'];
};

export type ScriptVersion = {
  __typename?: 'ScriptVersion';
  scriptid: Scalars['ID']['output'];
  time_saved: Scalars['String']['output'];
  title: Scalars['String']['output'];
  versionid: Scalars['ID']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  password: Scalars['String']['output'];
  userid: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type AddCollaboratorMutationVariables = Exact<{
  scriptid: Scalars['ID']['input'];
  email: Scalars['String']['input'];
}>;


export type AddCollaboratorMutation = { __typename?: 'Mutation', addCollaborator?: boolean | null };

export type CreateScriptMutationVariables = Exact<{
  userid: Scalars['ID']['input'];
  title: Scalars['String']['input'];
}>;


export type CreateScriptMutation = { __typename?: 'Mutation', createScript?: { __typename?: 'Script', scriptid: string, title: string } | null };

export type CreateScriptVersionMutationVariables = Exact<{
  scriptid: Scalars['ID']['input'];
  s3Link: Scalars['String']['input'];
}>;


export type CreateScriptVersionMutation = { __typename?: 'Mutation', createScriptVersion?: { __typename?: 'ScriptVersion', scriptid: string, time_saved: string, title: string } | null };

export type CreateUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'User', email: string, password: string, username: string, userid: string } | null };

export type DeleteScriptMutationVariables = Exact<{
  scriptid: Scalars['ID']['input'];
}>;


export type DeleteScriptMutation = { __typename?: 'Mutation', deleteScript?: boolean | null };

export type DeleteUserMutationVariables = Exact<{
  userid: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: boolean | null };

export type RemoveCollaboratorMutationVariables = Exact<{
  scriptid: Scalars['ID']['input'];
  email: Scalars['ID']['input'];
}>;


export type RemoveCollaboratorMutation = { __typename?: 'Mutation', removeCollaborator?: boolean | null };

export type UpdateScriptMutationVariables = Exact<{
  scriptid: Scalars['ID']['input'];
  title: Scalars['String']['input'];
}>;


export type UpdateScriptMutation = { __typename?: 'Mutation', updateScript?: { __typename?: 'Script', title: string } | null };

export type GetAllSharedScriptsQueryVariables = Exact<{
  userid: Scalars['ID']['input'];
}>;


export type GetAllSharedScriptsQuery = { __typename?: 'Query', getAllSharedScripts?: Array<{ __typename?: 'Script', scriptid: string, title: string, userid: string } | null> | null };

export type GetAllUserScriptsQueryVariables = Exact<{
  userid: Scalars['ID']['input'];
}>;


export type GetAllUserScriptsQuery = { __typename?: 'Query', getAllUserScripts?: Array<{ __typename?: 'Script', scriptid: string, title: string, last_modified: string } | null> | null };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers?: Array<{ __typename?: 'User', userid: string, email: string, username: string } | null> | null };

export type GetScriptVersionsQueryVariables = Exact<{
  scriptid: Scalars['ID']['input'];
}>;


export type GetScriptVersionsQuery = { __typename?: 'Query', getScriptVersions?: Array<{ __typename?: 'ScriptVersion', scriptid: string, time_saved: string, title: string } | null> | null };

export type LoginQueryVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginQuery = { __typename?: 'Query', login?: { __typename?: 'User', email: string, userid: string, username: string } | null };


export const AddCollaboratorDocument = gql`
    mutation AddCollaborator($scriptid: ID!, $email: String!) {
  addCollaborator(scriptid: $scriptid, email: $email)
}
    `;
export type AddCollaboratorMutationFn = Apollo.MutationFunction<AddCollaboratorMutation, AddCollaboratorMutationVariables>;

/**
 * __useAddCollaboratorMutation__
 *
 * To run a mutation, you first call `useAddCollaboratorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCollaboratorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCollaboratorMutation, { data, loading, error }] = useAddCollaboratorMutation({
 *   variables: {
 *      scriptid: // value for 'scriptid'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useAddCollaboratorMutation(baseOptions?: Apollo.MutationHookOptions<AddCollaboratorMutation, AddCollaboratorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCollaboratorMutation, AddCollaboratorMutationVariables>(AddCollaboratorDocument, options);
      }
export type AddCollaboratorMutationHookResult = ReturnType<typeof useAddCollaboratorMutation>;
export type AddCollaboratorMutationResult = Apollo.MutationResult<AddCollaboratorMutation>;
export type AddCollaboratorMutationOptions = Apollo.BaseMutationOptions<AddCollaboratorMutation, AddCollaboratorMutationVariables>;
export const CreateScriptDocument = gql`
    mutation CreateScript($userid: ID!, $title: String!) {
  createScript(userid: $userid, title: $title) {
    scriptid
    title
  }
}
    `;
export type CreateScriptMutationFn = Apollo.MutationFunction<CreateScriptMutation, CreateScriptMutationVariables>;

/**
 * __useCreateScriptMutation__
 *
 * To run a mutation, you first call `useCreateScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createScriptMutation, { data, loading, error }] = useCreateScriptMutation({
 *   variables: {
 *      userid: // value for 'userid'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateScriptMutation(baseOptions?: Apollo.MutationHookOptions<CreateScriptMutation, CreateScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateScriptMutation, CreateScriptMutationVariables>(CreateScriptDocument, options);
      }
export type CreateScriptMutationHookResult = ReturnType<typeof useCreateScriptMutation>;
export type CreateScriptMutationResult = Apollo.MutationResult<CreateScriptMutation>;
export type CreateScriptMutationOptions = Apollo.BaseMutationOptions<CreateScriptMutation, CreateScriptMutationVariables>;
export const CreateScriptVersionDocument = gql`
    mutation CreateScriptVersion($scriptid: ID!, $s3Link: String!) {
  createScriptVersion(scriptid: $scriptid, s3link: $s3Link) {
    scriptid
    time_saved
    title
  }
}
    `;
export type CreateScriptVersionMutationFn = Apollo.MutationFunction<CreateScriptVersionMutation, CreateScriptVersionMutationVariables>;

/**
 * __useCreateScriptVersionMutation__
 *
 * To run a mutation, you first call `useCreateScriptVersionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateScriptVersionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createScriptVersionMutation, { data, loading, error }] = useCreateScriptVersionMutation({
 *   variables: {
 *      scriptid: // value for 'scriptid'
 *      s3Link: // value for 's3Link'
 *   },
 * });
 */
export function useCreateScriptVersionMutation(baseOptions?: Apollo.MutationHookOptions<CreateScriptVersionMutation, CreateScriptVersionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateScriptVersionMutation, CreateScriptVersionMutationVariables>(CreateScriptVersionDocument, options);
      }
export type CreateScriptVersionMutationHookResult = ReturnType<typeof useCreateScriptVersionMutation>;
export type CreateScriptVersionMutationResult = Apollo.MutationResult<CreateScriptVersionMutation>;
export type CreateScriptVersionMutationOptions = Apollo.BaseMutationOptions<CreateScriptVersionMutation, CreateScriptVersionMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($username: String!, $email: String!, $password: String!) {
  createUser(username: $username, email: $email, password: $password) {
    email
    password
    username
    userid
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteScriptDocument = gql`
    mutation DeleteScript($scriptid: ID!) {
  deleteScript(scriptid: $scriptid)
}
    `;
export type DeleteScriptMutationFn = Apollo.MutationFunction<DeleteScriptMutation, DeleteScriptMutationVariables>;

/**
 * __useDeleteScriptMutation__
 *
 * To run a mutation, you first call `useDeleteScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteScriptMutation, { data, loading, error }] = useDeleteScriptMutation({
 *   variables: {
 *      scriptid: // value for 'scriptid'
 *   },
 * });
 */
export function useDeleteScriptMutation(baseOptions?: Apollo.MutationHookOptions<DeleteScriptMutation, DeleteScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteScriptMutation, DeleteScriptMutationVariables>(DeleteScriptDocument, options);
      }
export type DeleteScriptMutationHookResult = ReturnType<typeof useDeleteScriptMutation>;
export type DeleteScriptMutationResult = Apollo.MutationResult<DeleteScriptMutation>;
export type DeleteScriptMutationOptions = Apollo.BaseMutationOptions<DeleteScriptMutation, DeleteScriptMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($userid: ID!) {
  deleteUser(userid: $userid)
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      userid: // value for 'userid'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const RemoveCollaboratorDocument = gql`
    mutation RemoveCollaborator($scriptid: ID!, $email: ID!) {
  removeCollaborator(scriptid: $scriptid, email: $email)
}
    `;
export type RemoveCollaboratorMutationFn = Apollo.MutationFunction<RemoveCollaboratorMutation, RemoveCollaboratorMutationVariables>;

/**
 * __useRemoveCollaboratorMutation__
 *
 * To run a mutation, you first call `useRemoveCollaboratorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCollaboratorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCollaboratorMutation, { data, loading, error }] = useRemoveCollaboratorMutation({
 *   variables: {
 *      scriptid: // value for 'scriptid'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useRemoveCollaboratorMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCollaboratorMutation, RemoveCollaboratorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveCollaboratorMutation, RemoveCollaboratorMutationVariables>(RemoveCollaboratorDocument, options);
      }
export type RemoveCollaboratorMutationHookResult = ReturnType<typeof useRemoveCollaboratorMutation>;
export type RemoveCollaboratorMutationResult = Apollo.MutationResult<RemoveCollaboratorMutation>;
export type RemoveCollaboratorMutationOptions = Apollo.BaseMutationOptions<RemoveCollaboratorMutation, RemoveCollaboratorMutationVariables>;
export const UpdateScriptDocument = gql`
    mutation UpdateScript($scriptid: ID!, $title: String!) {
  updateScript(scriptid: $scriptid, title: $title) {
    title
  }
}
    `;
export type UpdateScriptMutationFn = Apollo.MutationFunction<UpdateScriptMutation, UpdateScriptMutationVariables>;

/**
 * __useUpdateScriptMutation__
 *
 * To run a mutation, you first call `useUpdateScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateScriptMutation, { data, loading, error }] = useUpdateScriptMutation({
 *   variables: {
 *      scriptid: // value for 'scriptid'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useUpdateScriptMutation(baseOptions?: Apollo.MutationHookOptions<UpdateScriptMutation, UpdateScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateScriptMutation, UpdateScriptMutationVariables>(UpdateScriptDocument, options);
      }
export type UpdateScriptMutationHookResult = ReturnType<typeof useUpdateScriptMutation>;
export type UpdateScriptMutationResult = Apollo.MutationResult<UpdateScriptMutation>;
export type UpdateScriptMutationOptions = Apollo.BaseMutationOptions<UpdateScriptMutation, UpdateScriptMutationVariables>;
export const GetAllSharedScriptsDocument = gql`
    query GetAllSharedScripts($userid: ID!) {
  getAllSharedScripts(userid: $userid) {
    scriptid
    title
    userid
  }
}
    `;

/**
 * __useGetAllSharedScriptsQuery__
 *
 * To run a query within a React component, call `useGetAllSharedScriptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllSharedScriptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllSharedScriptsQuery({
 *   variables: {
 *      userid: // value for 'userid'
 *   },
 * });
 */
export function useGetAllSharedScriptsQuery(baseOptions: Apollo.QueryHookOptions<GetAllSharedScriptsQuery, GetAllSharedScriptsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllSharedScriptsQuery, GetAllSharedScriptsQueryVariables>(GetAllSharedScriptsDocument, options);
      }
export function useGetAllSharedScriptsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllSharedScriptsQuery, GetAllSharedScriptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllSharedScriptsQuery, GetAllSharedScriptsQueryVariables>(GetAllSharedScriptsDocument, options);
        }
export type GetAllSharedScriptsQueryHookResult = ReturnType<typeof useGetAllSharedScriptsQuery>;
export type GetAllSharedScriptsLazyQueryHookResult = ReturnType<typeof useGetAllSharedScriptsLazyQuery>;
export type GetAllSharedScriptsQueryResult = Apollo.QueryResult<GetAllSharedScriptsQuery, GetAllSharedScriptsQueryVariables>;
export const GetAllUserScriptsDocument = gql`
    query GetAllUserScripts($userid: ID!) {
  getAllUserScripts(userid: $userid) {
    scriptid
    title
    last_modified
  }
}
    `;

/**
 * __useGetAllUserScriptsQuery__
 *
 * To run a query within a React component, call `useGetAllUserScriptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUserScriptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUserScriptsQuery({
 *   variables: {
 *      userid: // value for 'userid'
 *   },
 * });
 */
export function useGetAllUserScriptsQuery(baseOptions: Apollo.QueryHookOptions<GetAllUserScriptsQuery, GetAllUserScriptsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUserScriptsQuery, GetAllUserScriptsQueryVariables>(GetAllUserScriptsDocument, options);
      }
export function useGetAllUserScriptsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUserScriptsQuery, GetAllUserScriptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUserScriptsQuery, GetAllUserScriptsQueryVariables>(GetAllUserScriptsDocument, options);
        }
export type GetAllUserScriptsQueryHookResult = ReturnType<typeof useGetAllUserScriptsQuery>;
export type GetAllUserScriptsLazyQueryHookResult = ReturnType<typeof useGetAllUserScriptsLazyQuery>;
export type GetAllUserScriptsQueryResult = Apollo.QueryResult<GetAllUserScriptsQuery, GetAllUserScriptsQueryVariables>;
export const GetAllUsersDocument = gql`
    query GetAllUsers {
  getAllUsers {
    userid
    email
    username
  }
}
    `;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const GetScriptVersionsDocument = gql`
    query GetScriptVersions($scriptid: ID!) {
  getScriptVersions(scriptid: $scriptid) {
    scriptid
    time_saved
    title
  }
}
    `;

/**
 * __useGetScriptVersionsQuery__
 *
 * To run a query within a React component, call `useGetScriptVersionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScriptVersionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScriptVersionsQuery({
 *   variables: {
 *      scriptid: // value for 'scriptid'
 *   },
 * });
 */
export function useGetScriptVersionsQuery(baseOptions: Apollo.QueryHookOptions<GetScriptVersionsQuery, GetScriptVersionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetScriptVersionsQuery, GetScriptVersionsQueryVariables>(GetScriptVersionsDocument, options);
      }
export function useGetScriptVersionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetScriptVersionsQuery, GetScriptVersionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetScriptVersionsQuery, GetScriptVersionsQueryVariables>(GetScriptVersionsDocument, options);
        }
export type GetScriptVersionsQueryHookResult = ReturnType<typeof useGetScriptVersionsQuery>;
export type GetScriptVersionsLazyQueryHookResult = ReturnType<typeof useGetScriptVersionsLazyQuery>;
export type GetScriptVersionsQueryResult = Apollo.QueryResult<GetScriptVersionsQuery, GetScriptVersionsQueryVariables>;
export const LoginDocument = gql`
    query Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    email
    userid
    username
  }
}
    `;

/**
 * __useLoginQuery__
 *
 * To run a query within a React component, call `useLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginQuery({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginQuery(baseOptions: Apollo.QueryHookOptions<LoginQuery, LoginQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
      }
export function useLoginLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
export type LoginQueryHookResult = ReturnType<typeof useLoginQuery>;
export type LoginLazyQueryHookResult = ReturnType<typeof useLoginLazyQuery>;
export type LoginQueryResult = Apollo.QueryResult<LoginQuery, LoginQueryVariables>;