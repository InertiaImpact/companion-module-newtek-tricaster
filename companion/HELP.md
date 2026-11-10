## companion-module-newtek-tricaster

This module allows you to control the Tricaster line of video production switchers from NewTek.

### Configuration

- On the Tricaster under Administration Tools, turn off the LivePanel password
- Enter the IP address or hostname of the Tricaster in the module settings
- _Optional: To get variables from DataLink, enable "DataLink Variables" in the module settings"_

### Available Actions

- Take
- Auto transition
- Set Source to preview
- Set Source to program
- Set Source to M/E
- Set Source to DSK per ME (A & B bus)
- Set DSK On Air
- Set Transition Selection
- Media actions
  - Play/Play Toggle/Stop/Back/Forward
- Run System Macros
- Run Custom Macros
- Record (Toggle / Start / Stop)
- Stream (Toggle / Start / Stop)
- Set Mix Output
- Set a DataLink value
- Custom Shortcuts

### Available Feedbacks

- Source Tally (Program and Preview)
- Media Playing (DDRs, GFX, Stills, Titles, Sound)
- Recording
- Streaming
- DSK On-Air

### Available Variables

- Product Name
- Product Version
- Hostname
- Session Name
- Source on Program
- Source on Preview
- Recording Status
- Streaming Status
- DataLink key/value pairs _Note: must enable "DataLink Variables" in the module settings_

### Available Presets

- Sources to PGM
- Sources to PVW
- Sources to M/E 1
- Take
- Auto
- Record Toggle
- Streaming

## Audio controls

Audio actions cover the targets listed in the TriCaster shortcut dictionary: inputs 1�44, DDR 1�4, Sound, Effects, Master, Aux 1�3, Phones, Stream, Stream Main, Stream Aux, Talkback, DDR, Stills, and Titles. Available targets and controls depend on the TriCaster and session.

Use **Audio: Set volume** or **Audio: Adjust volume** for levels in dB. A negative adjustment decreases the volume. **Audio: Mute, solo or talkback** offers on, off and toggle for mute, solo, Talk and Skype Talkback. Toggle requires the current state from the TriCaster; it does nothing when that state is unknown. The original Set volume and Mute audio actions remain available for existing configurations.

Select **Use variable or target name** to enter a target such as `input1` or a Companion variable that resolves to one. Volume and adjustment fields also accept variables. Audio feedbacks indicate switch states or compare volume with a chosen level. Variables named `audio_<target>_volume`, `audio_<target>_mute`, `audio_<target>_solo`, `audio_<target>_talk`, and `audio_<target>_skype_talkback` contain values reported by the TriCaster. Unsupported states remain unavailable until reported.

Each target has mute, solo and talkback presets, volume up/down presets, and a volume/mute rotary preset. Rotate left or right to adjust by 1 dB and press to toggle mute. The rotary preset displays the reported volume.
