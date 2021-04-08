import { renderSlot } from 'vue';

var script = {
    name: 'accordiontab',
    props: {
        header: null,
        disabled: Boolean
    }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return renderSlot(_ctx.$slots, "default")
}

script.render = render;

export default script;
