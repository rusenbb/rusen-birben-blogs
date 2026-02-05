import { ImageResponse } from 'next/og';

interface OGImageProps {
  title: string;
  description?: string;
  author?: string;
}

export function generateOGImageResponse({ title, description, author = 'Rusen Birben' }: OGImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #faf8f5 0%, #f5f3f0 100%)',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header with site branding */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 700,
              marginRight: '16px',
            }}
          >
            R
          </div>
          <span style={{ fontSize: '24px', fontWeight: 600, color: '#1a1a1a' }}>
            rusen.ai/blog
          </span>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1.2,
              marginBottom: '24px',
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>
          
          {description && (
            <p
              style={{
                fontSize: '28px',
                color: '#4a4a4a',
                maxWidth: '800px',
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #d4d4d4',
            paddingTop: '32px',
          }}
        >
          <span style={{ fontSize: '24px', color: '#7a7a7a' }}>{author}</span>
          <span style={{ fontSize: '20px', color: '#7a7a7a' }}>rusen.ai/blog</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
