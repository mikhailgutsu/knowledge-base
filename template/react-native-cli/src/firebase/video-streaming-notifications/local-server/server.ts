import cors from 'cors'
import admin from 'firebase-admin'
import bodyParser from 'body-parser'
import express, { type Request, type Response } from 'express'

const app = express()

app.use(bodyParser.json())
app.use(cors())

import serviceAccount from

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  })

const fcmTokens: Set<string> = new Set()

app.post('/device/call', async (req: Request, res: Response) => {
  console.info()
  console.info('Received request:', req.body)
  console.info()
  const { token } = req.body

  if (!token) {
    res.status(400).send('FCM token is required')
    return
  }

  fcmTokens.add(token)

  const message: admin.messaging.Message = {
    token,
    data: {
      port: '44809',
    },
    apns: {
      headers: {
        'apns-priority': '10',
        'apns-push-type': 'alert',
        'apns-topic': 'org.reactjs.native.example',
      },
      payload: {
        aps: {
          alert: {
            title: 'Incoming call',
            body: 'You have an incoming call',
          },
          mutableContent: true,
          sound: 'intercom.aiff',
          contentAvailable: true,
          category: 'videoCategoryId',
          interruptionLevel: 'time-sensitive',
        },
      },
    },
  }

  try {
    const responseFCM = await admin.messaging().send(message)
    console.info('Successfully sent message:', responseFCM)
    res.status(200).send('Notification sent')
  } catch (error) {
    console.error('Error sending notification:', error)
    res.status(500).send('Failed to send notification')
  }
})

const PORT = 8080

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`)
})
