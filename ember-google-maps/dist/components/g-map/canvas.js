import templateOnly from '@ember/component/template-only';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<div\n  class=\"ember-google-map\"\n  ...attributes\n  {{g-map/did-insert @onCanvasReady}}\n>{{yield}}</div>");

var GMapCanvas = setComponentTemplate(TEMPLATE, templateOnly());

export { GMapCanvas as default };
//# sourceMappingURL=canvas.js.map
