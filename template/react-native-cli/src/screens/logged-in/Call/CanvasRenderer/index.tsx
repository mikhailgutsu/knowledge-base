import Canvas, {
  Image as CanvasImage,
  CanvasRenderingContext2D,
} from 'react-native-canvas'

export class CanvasRenderer {
  private canvas: Canvas

  constructor(canvas: Canvas) {
    if (!canvas) {
      throw new Error('Canvas is not initialized')
    }
    this.canvas = canvas
    this.canvas.width = 400
    this.canvas.height = 300
  }

  render(imageData: string): void {
    if (!this.canvas) {
      console.warn('Canvas is not available for rendering')
      return
    }

    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D | null

    if (!ctx) {
      throw new Error('2D context is not available')
    }

    const image = new CanvasImage(this.canvas)

    image.src = imageData
    image.addEventListener('load', () => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height)
    })
  }

  clear(): void {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D | null
      if (ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      }
    }
  }
}
