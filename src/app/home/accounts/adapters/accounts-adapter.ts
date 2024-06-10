import { Account } from "../schemas/account.schema";

export default function accountsAdapter(accounts: Account[]) {
  return accounts.map(account => ({
    accountId: account.id,
    name: account.name,
    type: account.type,
    createdAt: account.created_at,
    connectionParams: {
      id: account.connection_params.im.id,
      username: account.connection_params.im.username,
      premiumFeatures: account.connection_params.im.premiumFeatures,
      premiumContractId: account.connection_params.im.premiumContractId,
    },
    sources: account.sources.map(source => ({
      sourceId: source.id,
      status: source.status,
    })),
    groups: account.groups,
    subscription: "free"
  }));
}

export type AdaptedAccount = ReturnType<typeof accountsAdapter>[number];