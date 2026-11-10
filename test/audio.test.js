import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getActions } from '../actions.js'
import { getFeedbacks } from '../feedbacks.js'
import { getPresets } from '../presets.js'
import { getVariables } from '../variables.js'

function setup() {
	const sent = []
	const instance = {
		meList: [],
		mediaSourceNames: [],
		inputs: [],
		mediaTargets: [],
		meDestinations: [],
		dskDestinations: [],
		transitions: [],
		custom_macros: [],
		system_macros: [],
		shortcut_states: {},
		config: {},
		label: 'tricaster',
		sendCommand: (...args) => sent.push(args),
		log: () => {},
	}
	const context = {
		parseVariablesInString: async (s) => s.replace('$(custom:target)', 'input44').replace('$(custom:step)', '-2.5'),
	}
	return { instance, context, sent }
}

test('audio commands resolve variables and reject invalid numbers and targets', async () => {
	const { instance, context, sent } = setup()
	const actions = getActions.call(instance)
	await actions.audio_adjust.callback(
		{ options: { source: 'custom', custom_source: '$(custom:target)', amount: '$(custom:step)' } },
		context,
	)
	await actions.audio_set_volume.callback({ options: { source: 'master', volume: '0' } }, context)
	await actions.audio_adjust.callback({ options: { source: 'master', amount: 'nope' } }, context)
	await actions.audio_adjust.callback({ options: { source: 'custom', custom_source: 'input99', amount: '1' } }, context)
	assert.deepEqual(sent, [
		['input44_adjust_volume', '-2.5'],
		['master_volume', '0'],
	])
})

test('toggle requires a known state and feedback uses reported values', async () => {
	const { instance, context, sent } = setup()
	const actions = getActions.call(instance)
	const action = { options: { source: 'master', property: 'mute', operation: 'toggle' } }
	await actions.audio_switch.callback(action, context)
	instance.shortcut_states.master_mute = 'unexpected'
	await actions.audio_switch.callback(action, context)
	assert.equal(sent.length, 0)
	instance.shortcut_states.master_mute = 1
	await actions.audio_switch.callback(action, context)
	assert.deepEqual(sent, [['master_mute', 'false']])
	const feedbacks = getFeedbacks.call(instance)
	assert.equal(await feedbacks.audio_state.callback({ options: { source: 'master', property: 'mute' } }, context), true)
	instance.shortcut_states.master_volume = -12
	assert.equal(
		await feedbacks.audio_volume.callback({ options: { source: 'master', comparison: 'gte', level: -15 } }, context),
		true,
	)
	assert.equal(
		await feedbacks.audio_volume.callback({ options: { source: 'input1', comparison: 'gte', level: -15 } }, context),
		false,
	)
})

test('rotary preset and variables are available for inputs', () => {
	const { instance } = setup()
	const rotary = getPresets.call(instance).audio_input1_volume_rotary
	assert.equal(rotary.options.rotaryActions, true)
	assert.equal(rotary.steps[0].rotate_left[0].options.amount, '-1')
	assert.equal(rotary.steps[0].rotate_right[0].options.amount, '1')
	assert.match(rotary.style.text, /\$\(tricaster:audio_input1_volume\)/)
	assert.ok(getVariables.call(instance).some((v) => v.variableId === 'audio_input44_skype_talkback'))
})
