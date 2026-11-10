export const audioTargets = [
	...Array.from({ length: 44 }, (_, i) => ({ id: `input${i + 1}`, label: `Input ${i + 1}` })),
	...Array.from({ length: 4 }, (_, i) => ({ id: `ddr${i + 1}`, label: `DDR ${i + 1}` })),
	...[
		'sound',
		'effects',
		'master',
		'aux1',
		'aux2',
		'aux3',
		'phones',
		'stream',
		'stream_main',
		'stream_aux',
		'talkback',
		'ddr',
		'stills',
		'titles',
	].map((id) => ({ id, label: id.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) })),
]
export const audioSwitchProperties = ['mute', 'solo', 'talk', 'skype_talkback']
export const audioProperties = ['volume', ...audioSwitchProperties]
export const audioStateNames = new Set(
	audioTargets.flatMap((target) => audioProperties.map((property) => `${target.id}_${property}`)),
)
export const audioTargetOptions = [
	{
		type: 'dropdown',
		id: 'source',
		label: 'Audio target',
		default: 'input1',
		choices: [...audioTargets, { id: 'custom', label: 'Use variable or target name' }],
	},
	{
		type: 'textinput',
		id: 'custom_source',
		label: 'Target name or variable (e.g. input1)',
		default: '',
		useVariables: true,
		isVisibleExpression: `$(options:source) == 'custom'`,
	},
]
export async function resolveAudioTarget(options, context, instance) {
	const target =
		options.source === 'custom'
			? (await context.parseVariablesInString(String(options.custom_source ?? ''))).trim().toLowerCase()
			: options.source
	if (!audioTargets.some((item) => item.id === target)) {
		instance.log('warn', `Invalid audio target: ${target}`)
		return undefined
	}
	return target
}
export function audioStateIsOn(value) {
	return value === true || value === 1 || value === '1' || value === 'true'
}

export function audioStateIsKnown(value) {
	return (
		value === true ||
		value === false ||
		value === 1 ||
		value === 0 ||
		value === '1' ||
		value === '0' ||
		value === 'true' ||
		value === 'false'
	)
}
