import { NextResponse } from 'next/server'
import { z } from 'zod'

export type TLogReq = {
  error: string
  component: string
  block: string
  route: string
}

const logSchema = z.object({
  error: z.string(),
  component: z.string(),
  block: z.string(),
  route: z.string(),
})
export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin')
    const userAgent = request.headers.get('user-agent')
    const json = await request.json()

    const domain = process.env.NEXTAUTH_URL
    const parsedUrl = domain ? new URL(domain) : null

    const currentDate = new Date()

    if (parsedUrl?.origin !== origin) {
      console.error(
        '[LOG_ERROR] on Log API Route from:',
        origin,
        '|| user-agent:',
        userAgent,
        '|| Error:',
        'Origin and platform ENV do not match:',
        `-- Origin: ${origin} -- Platform ENV: ${parsedUrl?.origin}`,
      )

      return new NextResponse('Forbidden', { status: 403 })
    }

    const res = logSchema.parse(json) as TLogReq

    console.error(
      '[LOG_ERROR] on component:',
      res.component,
      '|| block:',
      res.block,
      '|| route:',
      res.route,
      '|| from:',
      origin,
      '|| user-agent:',
      userAgent,
      '|| Error_object:',
      res.error,
    )

    return new NextResponse('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If it's a Zod validation error, return a 400 response with details
      const validationErrors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }))

      return NextResponse.json(
        { message: 'Validation failed', errors: validationErrors },
        { status: 400 },
      )
    }
    console.error('error on log @POST: ', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
