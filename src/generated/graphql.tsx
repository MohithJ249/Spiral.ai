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
  updateScriptTitle?: Maybe<Script>;
};


export type MutationAddCollaboratorArgs = {
  email: Scalars['String']['input'];
  scriptid: Scalars['ID']['input'];
};


export type MutationCreateScriptArgs = {
  s3link: Scalars['String']['input'];
  title: Scalars['String']['input'];
  userid: Scalars['ID']['input'];
};


export type MutationCreateScriptVersionArgs = {
  s3link: Scalars['String']['input'];
  scriptid: Scalars['ID']['input'];
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


export type MutationUpdateScriptTitleArgs = {
  scriptid: Scalars['ID']['input'];
  title: Scalars['String']['input'];
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
  s3link: Scalars['String']['output'];
  scriptid: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  userid: Scalars['ID']['output'];
};

export type ScriptVersion = {
  __typename?: 'ScriptVersion';
  s3link: Scalars['String']['output'];
  scriptid: Scalars['ID']['output'];
  time_saved: Scalars['String']['output'];
  versionid: Scalars['ID']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  password: Scalars['String']['output'];
  userid: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type GetAllSharedScriptsQueryVariables = Exact<{
  userid: Scalars['ID']['input'];
}>;


export type GetAllSharedScriptsQuery = { __typename?: 'Query', getAllSharedScripts?: Array<{ __typename?: 'Script', s3link: string, scriptid: string, title: string, userid: string } | null> | null };

export type GetAllUserScriptsQueryVariables = Exact<{
  userid: Scalars['ID']['input'];
}>;


export type GetAllUserScriptsQuery = { __typename?: 'Query', getAllUserScripts?: Array<{ __typename?: 'Script', s3link: string, scriptid: string, title: string } | null> | null };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers?: Array<{ __typename?: 'User', userid: string, email: string, username: string } | null> | null };

export type GetScriptVersionsQueryVariables = Exact<{
  scriptid: Scalars['ID']['input'];
}>;


export type GetScriptVersionsQuery = { __typename?: 'Query', getScriptVersions?: Array<{ __typename?: 'ScriptVersion', s3link: string, scriptid: string, time_saved: string, versionid: string } | null> | null };

export type LoginQueryVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginQuery = { __typename?: 'Query', login?: { __typename?: 'User', email: string, userid: string, username: string } | null };


export const GetAllSharedScriptsDocument = gql`
    query GetAllSharedScripts($userid: ID!) {
  getAllSharedScripts(userid: $userid) {
    s3link
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
    s3link
    scriptid
    title
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
    s3link
    scriptid
    time_saved
    versionid
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