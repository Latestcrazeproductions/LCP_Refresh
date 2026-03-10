import { NextRequest, NextResponse } from 'next/server';
import http from 'node:http';
import https from 'node:https';

const _raw =
  process.env.NEXT_PUBLIC_SEMRUSH_API_URL || process.env.SEMRUSH_API_URL || 'http://127.0.0.1:5001';
const BACKEND_URL = (() => {
  let u = _raw.trim();
  if (!u.startsWith('http://') && !u.startsWith('https://')) u = 'http://' + u;
  return u.replace(/localhost(?=:|\/|$)/gi, '127.0.0.1').replace(/\/$/, '');
})();

function proxyRequest(
  method: string,
  path: string,
  body?: string
): Promise<{ status: number; contentType: string; body: Buffer; headers: Record<string, string> }> {
  return new Promise((resolve, reject) => {
    const u = new URL(BACKEND_URL + path);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request(
      {
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: u.pathname + u.search,
        method,
        headers: body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {},
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (ch) => chunks.push(ch));
        res.on('end', () => {
          const headers: Record<string, string> = {};
          const cd = res.headers['content-disposition'];
          if (cd) headers['content-disposition'] = Array.isArray(cd) ? cd[0] : cd;
          resolve({
            status: res.statusCode || 500,
            contentType: res.headers['content-type'] || 'application/octet-stream',
            body: Buffer.concat(chunks),
            headers,
          });
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await context.params;
  const backendPath = '/' + path.join('/');
  try {
    const { status, contentType, body, headers } = await proxyRequest('GET', backendPath);
    if (contentType.includes('application/json')) {
      const data = JSON.parse(body.toString());
      return NextResponse.json(data, { status });
    }
    const resHeaders = new Headers(headers);
    resHeaders.set('content-type', contentType);
    return new NextResponse(body, { status, headers: resHeaders });
  } catch (err) {
    return NextResponse.json(
      { error: 'Backend unreachable', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await context.params;
  const backendPath = '/' + path.join('/');
  const body = await request.text();
  try {
    const { status, body: resBody } = await proxyRequest('POST', backendPath, body);
    let data: unknown;
    try {
      data = resBody.length ? JSON.parse(resBody.toString()) : {};
    } catch {
      data = { error: resBody.toString() || 'Invalid response' };
    }
    return NextResponse.json(data, { status });
  } catch (err) {
    return NextResponse.json(
      { error: 'Backend unreachable', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await context.params;
  const backendPath = '/' + path.join('/');
  try {
    const { status, body: resBody } = await proxyRequest('DELETE', backendPath);
    let data: unknown = {};
    try {
      if (resBody.length) data = JSON.parse(resBody.toString());
    } catch {
      data = {};
    }
    return NextResponse.json(data, { status });
  } catch (err) {
    return NextResponse.json(
      { error: 'Backend unreachable', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }
}
