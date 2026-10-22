export default function manifest() {
  return {
    name: 'Liste della Spesa',
    short_name: 'Liste Spesa',
    description: 'Porta le liste della spesa sempre con te e gestiscile dal tuo smartphone',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    // IDEA(#5): add quick product shortcut
    icons: [
      {
        "purpose": "any maskable monochrome",
        "sizes": "48x48",
        "src": "icon_x48.png",
        "type": "image/png"
      },
      {
        "purpose": "maskable monochrome",
        "sizes": "96x96",
        "src": "icon_x96.png",
        "type": "image/png"
      },
      {
        "purpose": "any maskable monochrome",
        "sizes": "128x128",
        "src": "icon_x128.png",
        "type": "image/png"
      },
      {
        "purpose": "any maskable monochrome",
        "sizes": "192x192",
        "src": "icon_x192.png",
        "type": "image/png"
      },
      {
        "purpose": "maskable monochrome",
        "sizes": "512x512",
        "src": "icon_x512.png",
        "type": "image/png"
      }
    ],
  }
}