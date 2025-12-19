export {};

declare global {
  interface PasswordCredential extends Credential {
    readonly id: string;
    readonly name?: string;
    readonly password: string;
  }

  interface PasswordCredentialConstructor {
    new (data: {
      id: string;
      password: string;
      name?: string;
    }): PasswordCredential;
  }

  var PasswordCredential: PasswordCredentialConstructor;

  interface PasswordCredentialRequestOptions
    extends CredentialRequestOptions {
    password?: boolean;
  }
}
