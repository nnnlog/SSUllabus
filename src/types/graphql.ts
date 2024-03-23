import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum GradeRule {
  Absolute = 'ABSOLUTE',
  Relative = 'RELATIVE',
  Unknown = 'UNKNOWN'
}

export enum GradeScale {
  Pf = 'PF',
  Score = 'SCORE',
  Unknown = 'UNKNOWN'
}

export type IntSectionQuery = {
  max: Scalars['Int']['input'];
  min: Scalars['Int']['input'];
};

export enum Language {
  English = 'ENGLISH',
  Korean = 'KOREAN',
  MixedEnglishKorean = 'MIXED_ENGLISH_KOREAN',
  MixedNationKorean = 'MIXED_NATION_KOREAN',
  Nation = 'NATION',
  Unknown = 'UNKNOWN'
}

export type MultiMajor = {
  __typename?: 'MultiMajor';
  department: Scalars['String']['output'];
  detail_department: Scalars['String']['output'];
  isu_name: Scalars['String']['output'];
  univ: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  major_lists: Array<SubjectMajor>;
  multi_major_lists: Array<MultiMajor>;
  subject: Array<Subject>;
};


export type QueryMajor_ListsArgs = {
  semester: Semester;
  year: Scalars['Int']['input'];
};


export type QueryMulti_Major_ListsArgs = {
  semester: Semester;
  year: Scalars['Int']['input'];
};


export type QuerySubjectArgs = {
  bunban?: InputMaybe<Array<Scalars['String']['input']>>;
  code?: InputMaybe<Array<Scalars['String']['input']>>;
  credit?: InputMaybe<Array<Scalars['Float']['input']>>;
  grade_rule?: InputMaybe<Array<GradeRule>>;
  grade_scale?: InputMaybe<Array<GradeScale>>;
  is_el?: InputMaybe<Scalars['Boolean']['input']>;
  keyword?: InputMaybe<Array<Scalars['String']['input']>>;
  lang?: InputMaybe<Array<Language>>;
  limited_target?: InputMaybe<Scalars['Boolean']['input']>;
  listen_count?: InputMaybe<Array<IntSectionQuery>>;
  majors?: InputMaybe<Array<Scalars['String']['input']>>;
  multi_majors?: InputMaybe<Array<Scalars['String']['input']>>;
  open_department?: InputMaybe<Array<Scalars['String']['input']>>;
  process?: InputMaybe<Array<SubjectProcess>>;
  remain_count?: InputMaybe<Array<IntSectionQuery>>;
  semester: Semester;
  target?: InputMaybe<Array<Scalars['String']['input']>>;
  year: Scalars['Int']['input'];
};

export enum Semester {
  First = 'FIRST',
  Second = 'SECOND',
  Summer = 'SUMMER',
  Winter = 'WINTER'
}

export type Subject = {
  __typename?: 'Subject';
  bunban?: Maybe<Scalars['String']['output']>;
  code: Scalars['String']['output'];
  credit: Scalars['Float']['output'];
  grade_rule: GradeRule;
  grade_scale: GradeScale;
  is_el: Scalars['Boolean']['output'];
  lang: Language;
  limited_target: Scalars['Boolean']['output'];
  listen_count: Scalars['Int']['output'];
  majors: Array<Scalars['String']['output']>;
  multi_majors: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  open_department?: Maybe<Scalars['String']['output']>;
  process: SubjectProcess;
  professor?: Maybe<Scalars['String']['output']>;
  remain_count: Scalars['Int']['output'];
  semester: Semester;
  syllabus?: Maybe<Scalars['String']['output']>;
  target?: Maybe<Scalars['String']['output']>;
  time_place?: Maybe<Array<TimePlaceDb_Subject>>;
  year: Scalars['Int']['output'];
};

export type SubjectMajor = {
  __typename?: 'SubjectMajor';
  is_main: Scalars['Boolean']['output'];
  isu_name?: Maybe<Scalars['String']['output']>;
};

export enum SubjectProcess {
  Haksa = 'HAKSA',
  Sukbak = 'SUKBAK',
  Suksa = 'SUKSA',
  Unknown = 'UNKNOWN'
}

export type TimePlaceDb_Subject = {
  __typename?: 'TimePlaceDB_Subject';
  day?: Maybe<Scalars['String']['output']>;
  place?: Maybe<Scalars['String']['output']>;
  time_end?: Maybe<Scalars['String']['output']>;
  time_start?: Maybe<Scalars['String']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GradeRule: GradeRule;
  GradeScale: GradeScale;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IntSectionQuery: IntSectionQuery;
  Language: Language;
  MultiMajor: ResolverTypeWrapper<MultiMajor>;
  Query: ResolverTypeWrapper<{}>;
  Semester: Semester;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subject: ResolverTypeWrapper<Subject>;
  SubjectMajor: ResolverTypeWrapper<SubjectMajor>;
  SubjectProcess: SubjectProcess;
  TimePlaceDB_Subject: ResolverTypeWrapper<TimePlaceDb_Subject>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Float: Scalars['Float']['output'];
  Int: Scalars['Int']['output'];
  IntSectionQuery: IntSectionQuery;
  MultiMajor: MultiMajor;
  Query: {};
  String: Scalars['String']['output'];
  Subject: Subject;
  SubjectMajor: SubjectMajor;
  TimePlaceDB_Subject: TimePlaceDb_Subject;
};

export type MultiMajorResolvers<ContextType = any, ParentType extends ResolversParentTypes['MultiMajor'] = ResolversParentTypes['MultiMajor']> = {
  department?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  detail_department?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isu_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  univ?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  major_lists?: Resolver<Array<ResolversTypes['SubjectMajor']>, ParentType, ContextType, RequireFields<QueryMajor_ListsArgs, 'semester' | 'year'>>;
  multi_major_lists?: Resolver<Array<ResolversTypes['MultiMajor']>, ParentType, ContextType, RequireFields<QueryMulti_Major_ListsArgs, 'semester' | 'year'>>;
  subject?: Resolver<Array<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<QuerySubjectArgs, 'semester' | 'year'>>;
};

export type SubjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  bunban?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  credit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  grade_rule?: Resolver<ResolversTypes['GradeRule'], ParentType, ContextType>;
  grade_scale?: Resolver<ResolversTypes['GradeScale'], ParentType, ContextType>;
  is_el?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lang?: Resolver<ResolversTypes['Language'], ParentType, ContextType>;
  limited_target?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  listen_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  majors?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  multi_majors?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  open_department?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  process?: Resolver<ResolversTypes['SubjectProcess'], ParentType, ContextType>;
  professor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  remain_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  semester?: Resolver<ResolversTypes['Semester'], ParentType, ContextType>;
  syllabus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  target?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  time_place?: Resolver<Maybe<Array<ResolversTypes['TimePlaceDB_Subject']>>, ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectMajorResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubjectMajor'] = ResolversParentTypes['SubjectMajor']> = {
  is_main?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isu_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TimePlaceDb_SubjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimePlaceDB_Subject'] = ResolversParentTypes['TimePlaceDB_Subject']> = {
  day?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  place?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  time_end?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  time_start?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  MultiMajor?: MultiMajorResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subject?: SubjectResolvers<ContextType>;
  SubjectMajor?: SubjectMajorResolvers<ContextType>;
  TimePlaceDB_Subject?: TimePlaceDb_SubjectResolvers<ContextType>;
};

