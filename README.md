# Seed-Based Algorithmic Art Generator

This project is a deterministic algorithmic art generator that creates unique visual patterns based on user-provided seed values. The same seed will always produce the identical artwork, allowing for reproducible generative art.

## How It Works

The system uses a **pseudo-random number generator** initialized with your seed value. This generator creates a sequence of numbers that appear random but are completely determined by the initial seed:

```javascript
function createRandom(seed) {
    return function() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
}
```

For each seed, the algorithm:
1. Determines a pattern type from 16 possible categories
2. Selects a color palette from 38 available options
3. Chooses a complexity level from 10 possible settings
4. Generates a background from 8 different styles
5. Renders the selected pattern with consistent parameters

## Mathematical Possibilities

The generator can produce an astonishing number of unique artworks:

```
Pattern Types: 16
Palette Options: 38
Complexity Levels: 10
Background Styles: 8

Total Possible Combinations = 16 × 38 × 10 × 8 = 48,640
```

Additionally, the underlying pseudo-random number generator has a period of 233,280 distinct states, meaning the system can produce **233,280 unique artworks** before repeating patterns.

## Features
- Reproducible art generation
- Real-time rendering
- Responsive canvas
- Custom seed input
- Random seed generation
- Detailed pattern information display

The same seed will always generate the identical artwork, making this a powerful tool for creating and sharing reproducible generative art.
