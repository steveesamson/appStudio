export const Robaac = function (cans, principal) {
  const { id } = principal || {};
  const acl = {
      can: {},
      permissions: [],
    },
    normalizeRoles = function () {
      (cans || []).forEach((operation) => {
        if (typeof operation === 'string') {
          acl.permissions.push(operation);
          acl.can[operation] = function () {
            return true;
          };
        } else if (typeof operation === 'object') {
          acl.permissions.push(operation.name);
          acl.can[operation.name] = new Function('param', `return  ${operation.when};`);
        }
      });
    };

  normalizeRoles();

  return {
    can: function (operation, options = {}) {
      options = { ...options, sessionUser: id };

      // Check if this role has this operation
      if (acl.can[operation] && acl.can[operation](options)) {
        return true;
      }

      return false;
    },
  };
};
