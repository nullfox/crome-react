import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** BigNumber custom scalar */
  BigNumber: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: Date;
};

/** Crypto token pair */
export type Pair = {
  __typename?: 'Pair';
  address: Scalars['String'];
  dependentToken: Token;
  prices: Array<PairPrice>;
  reserve0: Scalars['String'];
  reserve1: Scalars['String'];
  token0: Token;
  token1: Token;
  transactions: Array<PairTransaction>;
  wcroPrice: Scalars['BigNumber'];
};

/** Crypto token pair price */
export type PairPrice = {
  __typename?: 'PairPrice';
  close: Scalars['BigNumber'];
  date: Scalars['DateTime'];
  high: Scalars['BigNumber'];
  low: Scalars['BigNumber'];
  open: Scalars['BigNumber'];
};

/** Crypto token pair buy or sell transaction */
export type PairTransaction = {
  __typename?: 'PairTransaction';
  amountIn: Scalars['String'];
  amountOut: Scalars['String'];
  date: Scalars['DateTime'];
  from: Scalars['String'];
  hash: Scalars['String'];
  tokenIn: Scalars['String'];
  tokenOut: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  token?: Maybe<Token>;
  wallet?: Maybe<Wallet>;
};


export type QueryTokenArgs = {
  address: Scalars['String'];
};


export type QueryWalletArgs = {
  address: Scalars['String'];
};

/** Crypto token */
export type Token = {
  __typename?: 'Token';
  address: Scalars['String'];
  basePair?: Maybe<Pair>;
  decimals: Scalars['Int'];
  iconUrl: Scalars['BigNumber'];
  isDead: Scalars['Boolean'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  totalSupply: Scalars['BigNumber'];
  usdcPer: Scalars['BigNumber'];
  wcroPer: Scalars['BigNumber'];
};

/** Crypto wallet */
export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['String'];
  tokens: Array<WalletToken>;
};

/** Crypto token for wallet */
export type WalletToken = {
  __typename?: 'WalletToken';
  address: Scalars['String'];
  balance?: Maybe<Scalars['BigNumber']>;
  basePair?: Maybe<Pair>;
  decimals: Scalars['Int'];
  iconUrl: Scalars['BigNumber'];
  isDead: Scalars['Boolean'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  totalSupply: Scalars['BigNumber'];
  usdcPer: Scalars['BigNumber'];
  usdcTotal: Scalars['BigNumber'];
  wcroPer: Scalars['BigNumber'];
};

export type TokenQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type TokenQuery = { __typename?: 'Query', token?: { __typename?: 'Token', address: string, name: string, symbol: string, decimals: number, totalSupply: any, wcroPer: any, usdcPer: any, iconUrl: any, basePair?: { __typename?: 'Pair', address: string, reserve0: string, reserve1: string, token0: { __typename?: 'Token', address: string, symbol: string }, token1: { __typename?: 'Token', address: string, symbol: string }, dependentToken: { __typename?: 'Token', address: string, symbol: string }, prices: Array<{ __typename?: 'PairPrice', open: any, high: any, low: any, close: any, date: Date }>, transactions: Array<{ __typename?: 'PairTransaction', hash: string, from: string, tokenIn: string, tokenOut: string, amountIn: string, amountOut: string, date: Date }> } | null } | null };

export type WalletTokensQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type WalletTokensQuery = { __typename?: 'Query', wallet?: { __typename?: 'Wallet', tokens: Array<{ __typename?: 'WalletToken', address: string, name: string, symbol: string, decimals: number, balance?: any | null, wcroPer: any, usdcPer: any, usdcTotal: any }> } | null };


export const TokenDocument = gql`
    query Token($address: String!) {
  token(address: $address) {
    address
    name
    symbol
    decimals
    totalSupply
    wcroPer
    usdcPer
    iconUrl
    basePair {
      address
      token0 {
        address
        symbol
      }
      token1 {
        address
        symbol
      }
      dependentToken {
        address
        symbol
      }
      reserve0
      reserve1
      prices {
        open
        high
        low
        close
        date
      }
      transactions {
        hash
        from
        tokenIn
        tokenOut
        amountIn
        amountOut
        date
      }
    }
  }
}
    `;

/**
 * __useTokenQuery__
 *
 * To run a query within a React component, call `useTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenQuery(baseOptions: Apollo.QueryHookOptions<TokenQuery, TokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokenQuery, TokenQueryVariables>(TokenDocument, options);
      }
export function useTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenQuery, TokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokenQuery, TokenQueryVariables>(TokenDocument, options);
        }
export type TokenQueryHookResult = ReturnType<typeof useTokenQuery>;
export type TokenLazyQueryHookResult = ReturnType<typeof useTokenLazyQuery>;
export type TokenQueryResult = Apollo.QueryResult<TokenQuery, TokenQueryVariables>;
export const WalletTokensDocument = gql`
    query WalletTokens($address: String!) {
  wallet(address: $address) {
    tokens {
      address
      name
      symbol
      decimals
      balance
      wcroPer
      usdcPer
      usdcTotal
    }
  }
}
    `;

/**
 * __useWalletTokensQuery__
 *
 * To run a query within a React component, call `useWalletTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useWalletTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWalletTokensQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useWalletTokensQuery(baseOptions: Apollo.QueryHookOptions<WalletTokensQuery, WalletTokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WalletTokensQuery, WalletTokensQueryVariables>(WalletTokensDocument, options);
      }
export function useWalletTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WalletTokensQuery, WalletTokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WalletTokensQuery, WalletTokensQueryVariables>(WalletTokensDocument, options);
        }
export type WalletTokensQueryHookResult = ReturnType<typeof useWalletTokensQuery>;
export type WalletTokensLazyQueryHookResult = ReturnType<typeof useWalletTokensLazyQuery>;
export type WalletTokensQueryResult = Apollo.QueryResult<WalletTokensQuery, WalletTokensQueryVariables>;