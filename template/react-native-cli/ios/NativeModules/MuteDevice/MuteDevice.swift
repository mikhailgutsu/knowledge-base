import Foundation
import React

@objc(MuteDevice)
class MuteDevice: NSObject, RCTBridgeModule {
    private let userDefaults = UserDefaults(suiteName: "group.org.reactjs.native.example")
    private let mutedDevicesKey = "mutedDevices"
    
    static func moduleName() -> String! {
        return "MuteDevice"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc
    func muteDevice(_ serialNumber: String, state: Bool) {
        var mutedDevices = getMutedDevices()
        
        if state {
            mutedDevices.insert(serialNumber)
        } else {
            mutedDevices.remove(serialNumber)
        }
        
        userDefaults?.set(Array(mutedDevices), forKey: mutedDevicesKey)
        userDefaults?.synchronize()
    }
    
    @objc
    func isDeviceMuted(_ serialNumber: String, callback: @escaping RCTResponseSenderBlock) {
        let mutedDevices = getMutedDevices()
        callback([mutedDevices.contains(serialNumber)])
    }
    
    private func getMutedDevices() -> Set<String> {
        guard let devices = userDefaults?.array(forKey: mutedDevicesKey) as? [String] else {
            return Set()
        }
        return Set(devices)
    }
}
