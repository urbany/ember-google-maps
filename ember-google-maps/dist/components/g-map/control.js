import MapComponent from './map-component.js';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { precompileTemplate } from '@ember/template-compilation';
import { g, i, n } from 'decorator-transforms/runtime-esm';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#if this.container}}\n  {{#in-element this.container}}\n    <div\n      id={{this.id}}\n      ...attributes\n      {{g-map/did-insert this.getControl}}\n    >{{yield}}</div>\n  {{/in-element}}\n{{/if}}");

class Control extends MapComponent {
  id = `ember-google-maps-control-${guidFor(this)}`;
  static {
    g(this.prototype, "container", [tracked], function () {
      return window?.document?.createElement('div');
    });
  }
  #container = (i(this, "container"), void 0);
  // Keep track of the current control position so that it can be removed on
  // teardown
  lastControlPosition = null;
  get name() {
    return 'controls';
  }
  setup(options) {
    // TODO: Support an existing control position
    let position = google.maps.ControlPosition[options.position];
    this.map.controls[position].push(this.controlElement);

    // Could use {{prop}} for this (from ember-prop-modifier)
    this.controlElement.index = options.index;
    this.lastControlPosition = position;
    return this.controlElement;
  }
  teardown() {
    let controls = this.map.controls[this.lastControlPosition];
    let index = controls.indexOf(this.controlElement);
    controls.removeAt(index);
  }
  getControl(element) {
    this.controlElement = element;
  }
  static {
    n(this.prototype, "getControl", [action]);
  }
}
setComponentTemplate(TEMPLATE, Control);

export { Control as default };
//# sourceMappingURL=control.js.map
