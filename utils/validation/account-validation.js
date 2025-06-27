export default function validateAccount(account) {
    const validUserId =
      account.userId !== undefined && typeof account.userId === "string";
  
    const validName =
      typeof account.name === "string" && account.name.trim().length > 1;
  
    const validProvider =
      typeof account.provider === "string" && account.provider.trim().length > 0;
  
    const validProviderAccountId =
      typeof account.providerAccountId === "string" &&
      account.providerAccountId.trim().length > 0;
  
    const validImage =
      account.image === undefined || typeof account.image === "string";
  
    const validPassword =
      account.password === undefined || typeof account.password === "string";
  
    return (
      validUserId &&
      validName &&
      validProvider &&
      validProviderAccountId &&
      validImage &&
      validPassword
    );
  }
  