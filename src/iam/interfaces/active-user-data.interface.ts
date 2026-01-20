export interface ActiveUserData {
  /**
   * The subject of the token (JWT "sub" claim).
   * The value of this field is the user ID that granted this token.
   * @see https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.2
   * */
  sub: number;

  /**
   * The subject's (user) email
   * */
  email: string;
}
