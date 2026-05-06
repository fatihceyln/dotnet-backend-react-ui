async function readErrorMessage(response) {
  const { status, statusText } = response

  try {
    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      const body = await response.json()
      const message =
        body.message ||
        body.error ||
        (body.errors && Object.values(body.errors).flat().join('\n')) ||
        [body.title, body.detail].filter(Boolean).join(': ')

      if (message) {
        return status >= 500 ? `HTTP ${status}: ${message}` : message
      }
    } else {
      const text = (await response.text()).trim()
      if (text) {
        return status >= 500 ? `HTTP ${status}: ${text}` : text
      }
    }
  } catch {}

  return status >= 500
    ? `HTTP ${status} ${statusText}`.trim()
    : statusText || 'Istek basarisiz oldu.'
}

export async function fetchJson(url, options = {}) {
  const headers = new Headers(options.headers ?? {})
  const hasBody = options.body !== undefined

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return null
  }

  return response.json()
}

export function showBackendError(error) {
  window.alert(error instanceof Error ? error.message : 'Beklenmeyen bir hata olustu.')
}
