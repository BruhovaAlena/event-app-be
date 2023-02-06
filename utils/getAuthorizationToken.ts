export const getAuthorizationToken = (authorizationHeader: string) => {
  const array = authorizationHeader.split(' ');
  if (array.length === 2 && array[0] === 'Bearer') {
    return array[1];
  }
  return null;
};
