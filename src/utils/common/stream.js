import { principal } from 'utils/session';

export const getQuery = (privacy, circle) => {
  const { streamId } = principal() || {};
  switch (privacy) {
    case 'global':
      return { query: { visibility: 'public' } };
    case 'private':
      return { query: { visibility: 'private', streamId } };
    case 'public':
      return { query: { visibility: 'followers', streamId } };
    case 'circle':
      const { circleId, name, active } = circle;
      canReact = active;
      title = name;
      const query = active ? { visibility: circleId } : { visibility: circleId, streamId };
      return { canReact, title, query };
  }
};
