export interface WebSocketServiceOptions {
  onError?: (error: Event) => void
  onFrameReceived: (imageData: string) => void
  onConnectionChange?: (connected: boolean) => void
}

export class WebSocketService {
  private lastSentTime: number = 0
  private isBackground: boolean = false
  private isConnecting: boolean = false
  private connectTimeout: NodeJS.Timeout | null = null
  private reconnectTimeout: NodeJS.Timeout | null = null
  private onFrameReceivedCallback: ((imageData: string) => void) | null = null

  socket: WebSocket | null = null

  constructor(private url: string, private options: WebSocketServiceOptions) {
    this.onFrameReceivedCallback = options.onFrameReceived
  }

  connect() {
    if (this.isBackground) {
      // console.log('Skipping connection while in background')
      return
    }

    if (this.isConnecting) {
      // console.log('Connection already in progress')
      return
    }

    if (this.socket?.readyState === WebSocket.OPEN) {
      // console.log('WebSocket already connected and open')
      return
    }

    this.isConnecting = true
    console.log('Starting new WebSocket connection...')
    this.clearTimeouts()
    this.cleanupSocket()

    try {
      this.socket = new WebSocket(this.url)
      this.socket.binaryType = 'arraybuffer'

      this.socket.onopen = () => {
        console.log('WebSocket connected successfully')
        this.isConnecting = false
        this.options.onConnectionChange?.(true)
      }

      this.socket.onmessage = (event) => {
        if (this.isBackground) return

        const arrayBuffer = event.data
        const currentTime = Date.now()

        if (arrayBuffer instanceof ArrayBuffer && currentTime - this.lastSentTime >= 50) {
          this.lastSentTime = currentTime

          const bytes = new Uint8Array(arrayBuffer)
          const base64String = btoa(
            bytes.reduce((data, byte) => data + String.fromCharCode(byte), '')
          )

          const imageData = `data:image/jpeg;base64,${base64String}`
          if (this.onFrameReceivedCallback && !this.isBackground) {
            this.onFrameReceivedCallback(imageData)
          }
        }
      }

      this.socket.onerror = (error) => {
        console.info('------- WebSocket Error:', error)
        this.handleConnectionFailure()
      }

      this.socket.onclose = () => {
        console.log('WebSocket closed')
        this.handleConnectionFailure()
      }
    } catch (error) {
      console.info('------- Error creating WebSocket:', error)
      this.handleConnectionFailure()
    }
  }

  private clearTimeouts() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    if (this.connectTimeout) {
      clearTimeout(this.connectTimeout)
      this.connectTimeout = null
    }
  }

  private handleConnectionFailure() {
    this.isConnecting = false
    this.options.onConnectionChange?.(false)
  }

  private cleanupSocket() {
    if (this.socket) {
      this.socket.onopen = null
      this.socket.onmessage = null
      this.socket.onerror = null
      this.socket.onclose = null

      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.close()
      }
      this.socket = null
    }
  }

  send(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message)
      // console.log(`WebSocket message sent: ${message}`)
    } else {
      // console.warn('WebSocket is not open. Message not sent:', message)
      if (!this.isBackground) {
        this.connect()
      }
    }
  }

  setOnFrameReceived(callback: (imageData: string) => void) {
    this.onFrameReceivedCallback = callback
  }

  close() {
    // console.log('Closing WebSocket connection')
    this.clearTimeouts()
    this.cleanupSocket()
    this.options.onConnectionChange?.(false)
  }

  setBackgroundState(isBackground: boolean) {
    // console.log(
    //   `WebSocket background state changing from ${this.isBackground} to ${isBackground}`
    // )

    if (this.isBackground === isBackground) {
      // console.log('Skipping redundant background state change')
      return
    }

    this.isBackground = isBackground

    if (isBackground) {
      // console.log('Closing WebSocket due to background state')
      this.close()
    } else {
      // console.log('Preparing to reconnect after foreground transition')
      this.connectTimeout = setTimeout(() => {
        if (!this.isBackground) {
          // console.log('Attempting to connect after background state change')
          this.connect()
        }
        this.connectTimeout = null
      }, 1000)
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }
}
