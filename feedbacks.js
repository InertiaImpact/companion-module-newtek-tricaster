import { audioTargetOptions, resolveAudioTarget, audioStateIsOn } from './audio.js'
import { combineRgb } from '@companion-module/base'

export function getFeedbacks() {
	const feedbacks = {}

	const ColorRed = combineRgb(200, 0, 0)
	const ColorGreen = combineRgb(0, 200, 0)

	feedbacks.tally_PGM = {
		type: 'boolean',
		name: 'Change style from program source',
		description: 'When source is on-air, button style will change',
		defaultStyle: { bgcolor: ColorRed },
		options: [
			{
				type: 'dropdown',
				label: 'Source',
				id: 'src',
				choices: this.inputs,
				default: '0',
			},
		],
		callback: (feedback) => {
			let source = this.inputs.find((el) => el.id == feedback.options.src)
			if (source?.on_pgm === 'true') {
				return true
			}
		},
	}

	feedbacks.tally_PVW = {
		type: 'boolean',
		name: 'Change style from preview source',
		description: 'When source is on preview bus, button style will change',
		defaultStyle: { bgcolor: ColorGreen },
		options: [
			{
				type: 'dropdown',
				label: 'Source',
				id: 'src',
				choices: this.inputs,
				default: '0',
			},
		],
		callback: (feedback) => {
			let source = this.inputs.find((el) => el.id == feedback.options.src)
			if (source?.on_prev === 'true') {
				return true
			}
		},
	}

	feedbacks.recording = {
		type: 'boolean',
		name: 'Change style when recording',
		description: 'When recording, button style will change',
		defaultStyle: { bgcolor: ColorRed },
		options: [],
		callback: () => {
			if (this.switcher.recording) {
				return true
			}
		},
	}

	feedbacks.streaming = {
		type: 'boolean',
		name: 'Change style when streaming',
		description: 'When streaming, button style will change',
		defaultStyle: { bgcolor: ColorRed },
		options: [],
		callback: () => {
			if (this.switcher.streaming) {
				return true
			}
		},
	}

	feedbacks.mediaPlaying = {
		type: 'boolean',
		name: 'Change style when media player is active',
		description: 'When media state is on play, button style will change',
		defaultStyle: { bgcolor: ColorGreen },
		options: [
			{
				type: 'dropdown',
				label: 'Media Player',
				id: 'target',
				choices: this.mediaSourceNames,
				default: 'ddr1',
			},
		],
		callback: (feedback) => {
			if (this.shortcut_states[`${feedback.options.target}_play`] == 'true') {
				return true
			}
		},
	}

	feedbacks.dskOnAir = {
		type: 'boolean',
		name: 'Change style when DSK is on air',
		description: 'When DSK is on air, button style will change',
		defaultStyle: { bgcolor: ColorGreen },
		options: [
			{
				type: 'dropdown',
				label: 'DSK',
				id: 'target',
				choices: this.dskDestinations,
				default: 'main_dsk1',
			},
		],
		callback: (feedback) => {
			return this.shortcut_states[`${feedback.options.target}_value`]
		},
	}

	feedbacks.audio_state = {
		type: 'boolean',
		name: 'Audio: Mute, solo or talkback active',
		defaultStyle: { bgcolor: ColorRed },
		options: [
			...audioTargetOptions,
			{
				type: 'dropdown',
				id: 'property',
				label: 'Control',
				default: 'mute',
				choices: [
					{ id: 'mute', label: 'Mute' },
					{ id: 'solo', label: 'Solo' },
					{ id: 'talk', label: 'Talk' },
					{ id: 'skype_talkback', label: 'Skype Talkback' },
				],
			},
		],
		callback: async (feedback, context) => {
			const target = await resolveAudioTarget(feedback.options, context, this)
			return target ? audioStateIsOn(this.shortcut_states[`${target}_${feedback.options.property}`]) : false
		},
	}
	feedbacks.audio_volume = {
		type: 'boolean',
		name: 'Audio: Volume comparison',
		defaultStyle: { bgcolor: ColorGreen },
		options: [
			...audioTargetOptions,
			{
				type: 'dropdown',
				id: 'comparison',
				label: 'Comparison',
				default: 'gte',
				choices: [
					{ id: 'gte', label: 'At or above' },
					{ id: 'lte', label: 'At or below' },
					{ id: 'eq', label: 'Equal to' },
				],
			},
			{ type: 'number', id: 'level', label: 'Level in dB', default: 0, min: -1000, max: 1000 },
		],
		callback: async (feedback, context) => {
			const target = await resolveAudioTarget(feedback.options, context, this)
			const raw = this.shortcut_states[`${target}_volume`]
			if (raw === undefined || raw === null || String(raw).trim() === '') return false
			const value = Number(raw)
			if (!Number.isFinite(value)) return false
			switch (feedback.options.comparison) {
				case 'gte':
					return value >= feedback.options.level
				case 'lte':
					return value <= feedback.options.level
				case 'eq':
					return value === feedback.options.level
				default:
					return false
			}
		},
	}
	return feedbacks
}
