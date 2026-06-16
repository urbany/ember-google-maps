import { helper } from '@ember/component/helper';

var hash = helper(function gMapHash(positional, named) {
  return {
    ...named
  };
});

export { hash as default };
//# sourceMappingURL=hash.js.map
