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

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers?: Array<{ __typename?: 'User', userid: string, email: string, username: string } | null> | null };


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