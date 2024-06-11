const UNIPILE_API_URL = process.env.NEXT_PUBLIC_UNIPILE_API_URL || ""
const UNIPILE_API_KEY = process.env.NEXT_PUBLIC_UNIPILE_API_KEY || ""

export const connectLinkedinAccount = async (username: string, password: string) => {
  const data = {
    provider: 'LINKEDIN',
    username: username,
    password: password,
  };

  try {
    const res = await fetch(`https://${UNIPILE_API_URL}/api/v1/accounts`, {
      method: 'POST',
      headers: {
        'X-API-KEY': UNIPILE_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result
  } catch (err) {
    throw err
  }
}

export const connectLinkedinAccountWithCookies = async (li_at: string, li_a?: string) => {
  const data = {
    provider: 'LINKEDIN',
    access_token: li_at,
    premium_token: li_a,
  };

  try {
    const res = await fetch(`https://${UNIPILE_API_URL}/api/v1/accounts`, {
      method: 'POST',
      headers: {
        'X-API-KEY': UNIPILE_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result
  } catch (err) {
    throw err
  }
}

export const reconnectLinkedinAccount = async (username: string, password: string, accountId: string) => {
  const data = {
    provider: 'LINKEDIN',
    username: username,
    password: password,
  };

  try {
    const res = await fetch(`https://${UNIPILE_API_URL}/api/v1/accounts/${accountId}`, {
      method: 'POST',
      headers: {
        'X-API-KEY': UNIPILE_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to reconnect account');

    const result = await res.json();
    return result
  } catch (err) {
    throw err
  }
}

export const solveCheckpoint = async (checkpoint: any, code: string) => {
  const data = {
    provider: 'LINKEDIN',
    account_id: checkpoint.account_id,
    code: code,
  };

  try {
    const res = await fetch(`https://${UNIPILE_API_URL}/api/v1/accounts/checkpoint`, {
      method: 'POST',
      headers: {
        'X-API-KEY': UNIPILE_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result
  } catch (err) {
    throw err
  }
}

export const getAllAccounts = async () => {
  try {
    const res = await fetch(`https://${UNIPILE_API_URL}/api/v1/accounts`, {
      method: 'GET',
      headers: {
        'X-API-KEY': UNIPILE_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Failed to fetch accounts');

    const result = await res.json();
    console.log(result)
    return result
  } catch (err) {
    throw err
  }
}

export const getAccountsByIds = async (ids: string[]) => {
  try {
    const fetchAccountById = async (id: string) => {
      const res = await fetch(`https://${UNIPILE_API_URL}/api/v1/accounts/${id}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': UNIPILE_API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch account with id ${id}`);

      return res.json();
    };

    const accounts = await Promise.all(ids.map(id => fetchAccountById(id)));

    return accounts;
  } catch (err) {
    throw err;
  }
};

export const deleteAccount = async (id: string) => {
  try {
    const res = await fetch(`https://${UNIPILE_API_URL}/api/v1/accounts/${id}`, {
      method: 'DELETE',
      headers: {
        'X-API-KEY': UNIPILE_API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`Failed to delete account with id ${id}`);

    return res.json();
  } catch (err) {
    throw err;
  }
}
