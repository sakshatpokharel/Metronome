# BeatBox - Web-Based Metronome

A clean, modern, music-themed metronome application for musicians built with vanilla HTML, CSS, and JavaScript.

## Features

✨ **Core Functionality**
- Accurate metronome timing using Web Audio API
- BPM range: 40-240 beats per minute (default: 120)
- Visual beat indicator with pulse animation
- Beat counter showing current beat in measure
- Start/Stop button with keyboard shortcut (Spacebar)

🎛️ **Controls**
- Large BPM display with real-time updates
- BPM slider for smooth tempo adjustment
- Increase (+) and Decrease (-) buttons for fine-tuning
- All controls update synchronized displays

🎨 **Design**
- Modern, dark music-themed interface
- Spotify-inspired green accent color (#1db954)
- Smooth animations and transitions
- Fully responsive layout (desktop, tablet, mobile)
- Accessible with keyboard navigation and focus states

🔊 **Audio**
- Synthesized beats using Web Audio API (no audio files needed)
- Higher frequency (1000Hz) for first beat of measure
- Lower frequency (800Hz) for other beats
- Natural exponential decay envelope

⚡ **Performance**
- Lightweight - no external dependencies
- Optimized scheduler with 25ms lookahead for smooth playback
- Resume audio context on first interaction (browser requirement)

## File Structure

```
metronome/
├── index.html    - HTML structure and layout
├── styles.css    - Styling with animations and responsive design
├── script.js     - Metronome logic and timing
└── README.md     - This file
```

## How to Use

1. Open `index.html` in a web browser
2. Adjust BPM using:
   - Slider for continuous adjustment
   - +/- buttons for precise control (±5 BPM)
   - Direct display click to focus input
3. Click **Start** button or press **Spacebar** to begin
4. Watch the visual beat indicator pulse with the beat
5. Monitor the beat counter to see your position in the measure
6. Click **Stop** to halt playback

## Technical Details

### Timing Mechanism
- Uses `AudioContext.currentTime` for ultra-precise timing reference
- Scheduler runs every 25ms to queue upcoming beats
- Beats are scheduled 100ms ahead for smooth playback
- No setTimeout drift - audio timing is the authoritative clock

### Browser Compatibility
- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (with webkit prefix)
- Edge: ✅ Full support
- Mobile browsers: ✅ Full support with responsive design

### Audio Context
- Lazily initialized on first interaction (browser security requirement)
- Automatically resumed if suspended
- Uses standard Web Audio API (no external libraries)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Spacebar | Toggle Start/Stop |

## Accessibility Features

- Semantic HTML with proper ARIA labels
- Keyboard navigation support
- Focus-visible states for keyboard users
- Reduced motion support for users with motion sensitivity
- High contrast UI with accessible color combinations
- Clear visual hierarchy and spacing

## Customization

### Change Default BPM
Edit `script.js` line 16:
```javascript
this.bpm = 120; // Change to your preferred default
```

### Adjust Beats Per Measure
Edit `script.js` line 20:
```javascript
this.beatsPerMeasure = 4; // Change to 3 for 3/4 time, etc.
```

### Modify Beat Frequencies
Edit `script.js` in the `playBeatSound()` method:
```javascript
const frequency = isFirstBeat ? 1000 : 800; // Adjust frequencies
```

### Change Theme Colors
Edit `styles.css` CSS variables at the top:
```css
--primary-color: #1db954;
--secondary-color: #191414;
--accent-color: #1f1f1f;
```

## Performance Tips

- Metronome timing is handled independently from rendering
- Beat sounds are generated on-demand (no audio file loading)
- Optimized animations use CSS transforms and opacity
- Responsive images and layout reduce mobile overhead

## Future Enhancement Ideas

- Add preset tempo buttons (slow, moderate, fast)
- Support for different time signatures (3/4, 6/8, etc.)
- Volume control for beat sounds
- Visual metronome display (moving bar)
- Sound selection options (click, beep, xylophone, etc.)
- Subdivisions (eighth notes, triplets)
- Practice session timer
- Tap-tempo feature
- Presets for different music genres

## License

Free to use and modify for personal or educational use.

## Author

Created as a practice tool for musicians and students.

---

**Enjoy your practice! 🎵**
