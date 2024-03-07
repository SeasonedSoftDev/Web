export type TUserBasicInfo = {
  id?: number;
  email?: string;
};

/**
 * Returns a user's identity based on info from the parameter.
 * If for example only an id is supplied, id is returned. If only an email,
 * then email is supplied. If both, response would would be in a format like
 * in the example below. The number within brackets is an id.
 *
 * The function can be used to describe user by providing more than just one
 * parameter, or to just reduce a code complexity and have a flexibility where
 * you want to show who's responsible for the event, by writing one line.
 *
 * @example
 * "john.doe@example.com (100005)"
 *
 * @param param0 user's id or an email, or both
 * @returns stringified description of a user
 */
export const userIdentity = ({ id, email }: TUserBasicInfo) =>
  id ? (email ? `${email} (${id})` : id) : email;
