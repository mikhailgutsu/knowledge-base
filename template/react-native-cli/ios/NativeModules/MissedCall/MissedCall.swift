import Foundation
import React
import AVFoundation

@objc(MissedCall)
class MissedCall: NSObject, RCTBridgeModule  {
        
    static func moduleName() -> String! {
        return "MissedCall"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    private var hasMissedCall: Bool = false
    
    @objc
    func getMissedCall(_ callback: RCTResponseSenderBlock) {
        let userDefaults = UserDefaults(suiteName: "group.org.reactjs.native.example")
        let hasMissedCall = userDefaults?.bool(forKey: "hasMissedCall") ?? false
        callback([hasMissedCall])
    }
    
    @objc
    func setMissedCall(_ state: Bool) {
        hasMissedCall = state
        
        let userDefaults = UserDefaults(suiteName: "group.org.reactjs.native.example")
        userDefaults?.set(state, forKey: "hasMissedCall")
        userDefaults?.synchronize()
    }
}


