import Component from '@glimmer/component';
import { warn } from '@ember/debug';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{!-- Don’t {{yield}} anything. We don’t want to render blocks, like overlays. --}}");

class WarnMissingComponent extends Component {
  constructor() {
    super(...arguments);
    let name = this.args.name;
    let message = `
Ember Google Maps couldn't find a map component called "${name}"!

If you are excluding certain map components from your app in your ember-cli-build.js, make sure to
include "${name}".

Learn more at: https://ember-google-maps.sandydoo.me/docs/advanced#treeshaking`;
    warn(message, {
      id: 'ember-google-maps:warn-missing-component'
    });
  }
}
setComponentTemplate(TEMPLATE, WarnMissingComponent);

export { WarnMissingComponent as default };
//# sourceMappingURL=warn-missing-component.js.map
