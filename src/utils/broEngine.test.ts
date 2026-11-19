import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseLocalBroDirective,
  getPhaseAccentColor,
  getPhaseLabel,
  DEFAULT_HERMES_CONTEXT,
  DEFAULT_BRO_SETTINGS,
} from './broEngine';

test('parseLocalBroDirective handles self evolve and voice mode toggles', () => {
  const evolve = parseLocalBroDirective('Hey Bro, self evolve now');
  assert.equal(evolve.handled, true);
  assert.equal(evolve.triggerSelfEvolve, true);

  const alwaysOn = parseLocalBroDirective('always on');
  assert.equal(alwaysOn.handled, true);
  assert.equal(alwaysOn.settingsPatch?.alwaysOn, true);

  const alwaysOff = parseLocalBroDirective('turn off always on');
  assert.equal(alwaysOff.handled, true);
  assert.equal(alwaysOff.settingsPatch?.alwaysOn, false);
});

test('parseLocalBroDirective switches hologram screen styles and opens dialogs', () => {
  const holo = parseLocalBroDirective('Switch to hologram avatar mode');
  assert.equal(holo.handled, true);
  assert.equal(holo.settingsPatch?.screenStyle, 'hologram');

  const arc = parseLocalBroDirective('Show arc reactor sphere');
  assert.equal(arc.handled, true);
  assert.equal(arc.settingsPatch?.screenStyle, 'arcReactor');

  const dump = parseLocalBroDirective('Open brain dump');
  assert.equal(dump.handled, true);
  assert.equal(dump.openDialog, 'brainDump');

  const gestures = parseLocalBroDirective('Activate air gestures');
  assert.equal(gestures.handled, true);
  assert.equal(gestures.settingsPatch?.airGesturesEnabled, true);
  assert.equal(gestures.openDialog, 'airGestures');
});

test('parseLocalBroDirective passes general questions to Gemini AI core', () => {
  const general = parseLocalBroDirective('Summarize quantum computing in 2 sentences');
  assert.equal(general.handled, false);
});

test('getPhaseAccentColor maps phases to exact Jarvis/Bro Cyan-Purple-Gold palette', () => {
  assert.equal(getPhaseAccentColor('idle'), '#00E5FF');
  assert.equal(getPhaseAccentColor('listening'), '#00E5FF');
  assert.equal(getPhaseAccentColor('thinking'), '#BA68C8');
  assert.equal(getPhaseAccentColor('speaking'), '#FFB300');
  assert.equal(getPhaseAccentColor('executing'), '#FF9100');
});

test('getPhaseLabel formats executing step numbers accurately', () => {
  assert.equal(getPhaseLabel('listening'), 'LISTENING');
  assert.equal(getPhaseLabel('thinking'), 'COMPUTING');
  assert.equal(getPhaseLabel('executing', 3), 'AUTOMATION STEP #3');
  assert.equal(getPhaseLabel('executing', 0), 'TASK IN PROGRESS');
});

test('default Hermes context and settings are cleanly initialized for BRO', () => {
  assert.ok(DEFAULT_HERMES_CONTEXT.soul.includes('BRO'));
  assert.equal(DEFAULT_BRO_SETTINGS.theme, 'dark');
  assert.equal(DEFAULT_BRO_SETTINGS.screenStyle, 'arcReactor');
});
