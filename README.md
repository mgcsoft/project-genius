# Walking Route TUE

A simple web app that shows your live GPS location on a custom map image.

## How it works

The app uses your browser's geolocation API to track your position and displays a red dot on a map image. The dot updates in real-time as you move.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your map image as `public/map.png`

3. Update the GPS bounds in `app/components/LocationMap.tsx` to match your map's corners

4. Run the dev server:
   ```bash
   npm run dev
   ```

## Testing on mobile

Geolocation requires HTTPS. For local testing on your phone, either:
- Use `npm run dev -- --experimental-https`
- Use ngrok: `npx ngrok http 3000`

## Configuration

Edit `MAP_BOUNDS` in `LocationMap.tsx` with the GPS coordinates of your map's four corners:

```typescript
const MAP_BOUNDS = {
  topLeft: { lat: ..., lng: ... },
  topRight: { lat: ..., lng: ... },
  bottomLeft: { lat: ..., lng: ... },
  bottomRight: { lat: ..., lng: ... },
};
```
