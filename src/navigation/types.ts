export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  PinSetup: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  InvestTab: undefined;
  SaveTab: undefined;
  GroupsTab: undefined;
  MoreTab: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  Wallet: undefined;
  AddMoney: undefined;
  Withdraw: undefined;
  CreateGoal: undefined;
  GroupDetail: { groupId: number };
  JoinGroup: undefined;
  TransactionHistory: undefined;
  Profile: undefined;
  Notifications: undefined;
};
