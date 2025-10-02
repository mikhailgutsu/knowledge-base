import UserNotifications

class NotificationService: UNNotificationServiceExtension {
    var callContent: UNMutableNotificationContent?
    var contentHandler: ((UNNotificationContent) -> Void)?
    var notificationCenter = UNUserNotificationCenter.current()

    let missedCallContent = UNMutableNotificationContent()
    let userDefaults = UserDefaults(suiteName: "group.org.reactjs.native.example?????")

    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        self.contentHandler = contentHandler

        callContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
        
        if let callContent = callContent {
            configureNotificationContent(for: request, content: callContent)
            deliverNotification(content: callContent)
            scheduleMissedCallNotification(for: request, content: missedCallContent)
        } else {
            contentHandler(request.content)
        }
    }
    
    override func serviceExtensionTimeWillExpire() {
        if let contentHandler = contentHandler, let callContent = callContent {
            contentHandler(callContent)
        }
    }
    
    private func configureNotificationContent(for request: UNNotificationRequest, content: UNMutableNotificationContent) {
        // native module states ----------------------------------------
        // Read "isMuteApp" state
        let isMuteApp = userDefaults?.bool(forKey: "isMuteApp") ?? false

        // Read the "serialNumber" state //! Numbber double "b", because from server it comes as serialNumbber
        let serialNumber = request.content.userInfo["serialNumbber"] as? String ?? "unknown"

        // Read "mutedDevices" state
        let mutedDevicesArray = userDefaults?.array(forKey: "mutedDevices") as? [String] ?? []
        let mutedDevices = Set(mutedDevicesArray)

        // Read "isDeviceMuted" state
        let isDeviceMuted = mutedDevices.contains(serialNumber)

        // Read "customRingtone" state
        let customRingtone = userDefaults?.string(forKey: "ringtone") ?? "intercom.aiff"
        // native module states ----------------------------------------

        // Assign the category to the notification content
        content.categoryIdentifier = request.identifier

        // Define actions
        let acceptAction = UNNotificationAction(identifier: "ACCEPT_ACTION",
                                                title: "Accept",
                                                options: [.foreground])
        let declineAction = UNNotificationAction(identifier: "DECLINE_ACTION",
                                                 title: "Decline",
                                                 options: [.destructive])
        
        // Define category
        let category = UNNotificationCategory(identifier: request.identifier,
                                              actions: [acceptAction, declineAction],
                                              intentIdentifiers: [],
                                              options: [])
        // Register the category
        notificationCenter.setNotificationCategories([category])

        // Set the notification title
        if isMuteApp {
            content.title = "\(content.title) - silent mode"
        } else if isDeviceMuted {
            content.title = "\(content.title) - silent mode"
        } else {
            content.title = "\(content.title)"
        }

        // Set the notification body
        content.body = "From device \(serialNumber)"

        // Set the notification sound
        if isMuteApp {
            content.sound = nil
        } else if isDeviceMuted {
            content.sound = nil
        } else {
            content.sound = UNNotificationSound(named: UNNotificationSoundName(customRingtone))
        }

        // Set the notification badge
        content.badge = NSNumber(value: 0)

        // Set the notification image
        if let imageURL = Bundle(for: type(of: self)).url(forResource: "notification-call", withExtension: "png") {
            do {
                let attachment = try UNNotificationAttachment(identifier: "image", url: imageURL, options: nil)
                content.attachments = [attachment]
            } catch {
                NSLog("NotificationService: Failed to create attachment: \(error)")
            }
        }
    }
    
    private func deliverNotification(content: UNMutableNotificationContent) {
        if let contentHandler = contentHandler {
            contentHandler(content)
        }
    }
    
    private func scheduleMissedCallNotification(for request: UNNotificationRequest, content: UNMutableNotificationContent) {
        // native module states ----------------------------------------
        // Read "isMuteApp" state
        let isMuteApp = userDefaults?.bool(forKey: "isMuteApp") ?? false

        // Read the "serialNumber" state //! Numbber double "b", because from server it comes as serialNumbber
        let serialNumber = request.content.userInfo["serialNumbber"] as? String ?? "unknown"
        
        // Read "mutedDevices" state
        let mutedDevicesArray = userDefaults?.array(forKey: "mutedDevices") as? [String] ?? []
        let mutedDevices = Set(mutedDevicesArray)

        // Read "isDeviceMuted" state
        let isDeviceMuted = mutedDevices.contains(serialNumber)
        // native module states ----------------------------------------

        // Set the notification title
        missedCallContent.title = "Missed Call"

        // Set the notification body
        missedCallContent.body = "From device \(serialNumber)"

        // Set the notification sound
        if isMuteApp {
            missedCallContent.sound = nil
        } else if isDeviceMuted {
            missedCallContent.sound = nil
        } else {
            missedCallContent.sound = UNNotificationSound.default
        }

        // Set the notification badge
        missedCallContent.badge = NSNumber(value: 0)

        // Set the notification image
        if let imageMissedCallURL = Bundle(for: type(of: self)).url(forResource: "notification-missed-call", withExtension: "png") {
            do {
                let attachment = try UNNotificationAttachment(identifier: "image", url: imageMissedCallURL, options: nil)
                missedCallContent.attachments = [attachment]
            } catch {
                NSLog("NotificationService: Failed to create attachment: \(error)")
            }
        }

        // Remove the pending notification requests
        notificationCenter.removePendingNotificationRequests(withIdentifiers: [request.identifier])

        // Schedule the notification
        let clearTrigger = UNTimeIntervalNotificationTrigger(timeInterval: 30, repeats: false)
        let clearRequest = UNNotificationRequest(identifier: request.identifier, content: missedCallContent, trigger: clearTrigger)

        // Add the notification to the notification center
        notificationCenter.add(clearRequest) { error in
            if let error = error {
                NSLog("Error scheduling missed call notification: \(error)")
            } else {
                NSLog("Scheduled to clear notifications after 30 seconds")
            }
        }
    }
}
