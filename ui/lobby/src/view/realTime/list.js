var m = require('mithril');
var util = require('chessground').util;
var tds = require('../util').tds;

function renderHook(ctrl, hook) {
  return m('tr', {
    key: hook.id,
    title: (hook.action === 'join') ? ctrl.trans('joinTheGame') + ' - ' + hook.perf.name : ctrl.trans('cancel'),
    'data-id': hook.id,
    class: 'hook ' + hook.action + (hook.disabled ? ' disabled' : '')
  }, tds([
    m('span', {
      class: 'is is2 color-icon ' + (hook.color || 'random')
    }), (hook.rating ? m('a.ulink', {
      href: '/@/' + hook.username
    }, hook.username) : 'Anonymous'),
    hook.rating ? hook.rating : '',
    hook.clock, [m('span', {
      class: 'varicon',
      'data-icon': hook.perf.icon
    }), ctrl.trans(hook.mode === 1 ? 'rated' : 'casual')]
  ]));
};

function isStandard(value) {
  return function(hook) {
    return (hook.variant === 'STD') === value;
  };
}

module.exports = {
  toggle: function(ctrl) {
    return m('span', {
      'data-hint': ctrl.trans('graph'),
      class: 'mode_toggle hint--bottom',
      onclick: util.partial(ctrl.setMode, 'chart')
    }, m('span.chart[data-icon=9]'));
  },
  render: function(ctrl, allHooks) {
    var max = 14;
    var hooks = allHooks.slice(0, max);
    var standards = hooks.filter(isStandard(true))
      .map(util.partial(renderHook, ctrl));
    var variants = hooks.filter(isStandard(false))
      .slice(0, Math.max(0, max - standards.length - 1))
      .map(util.partial(renderHook, ctrl));
    return m('table.table_wrap', [
      m('thead',
        m('tr', [
          m('th'),
          m('th', ctrl.trans('player')),
          m('th', 'Rating'),
          m('th', ctrl.trans('time')),
          m('th', ctrl.trans('mode'))
        ])
      ),
      m('tbody', {
        class: ctrl.vm.stepping ? 'stepping' : '',
        onclick: function(e) {
          var el = e.target;
          if (el.classList.contains('ulink')) return;
          do {
            el = el.parentNode;
            if (el.nodeName === 'TR') return ctrl.clickHook(el.getAttribute('data-id'));
          }
          while (el.nodeName !== 'TABLE');
        }
      }, [
        standards,
        variants.length ? m('tr.variants',
          m('td[colspan=5]', '- ' + ctrl.trans('variant') + ' -')
        ) : null,
        variants
      ])
    ]);
  }
};
