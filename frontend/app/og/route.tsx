import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Nestera';
  const description = searchParams.get('description') || 'Decentralized Savings on Stellar';

  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #061a1a 0%, #0a2d2d 100%)',
            padding: '60px 80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Logo/Branding Area */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#00d4d4',
              marginBottom: 40,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            ◆ Nestera ◆
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: 30,
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '100%',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 28,
              color: '#a0e0df',
              textAlign: 'center',
              lineHeight: 1.4,
              maxWidth: '100%',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </div>

          {/* Bottom accent */}
          <div
            style={{
              marginTop: 60,
              height: 3,
              width: 100,
              background: '#00d4d4',
              borderRadius: 2,
            }}
          />

          {/* Footer text */}
          <div
            style={{
              marginTop: 40,
              fontSize: 16,
              color: '#708a8a',
            }}
          >
            Decentralized Savings on Stellar
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image Generation Error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
