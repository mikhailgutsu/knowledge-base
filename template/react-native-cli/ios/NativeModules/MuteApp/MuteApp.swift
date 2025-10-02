import Foundation
import React
import AVFoundation

@objc(MuteApp)
class MuteApp: NSObject, RCTBridgeModule {
  
  static func moduleName() -> String! {
    return "MuteApp"
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  private var isMuteApp: Bool = false
  
  @objc
  func getMuteAppState(_ callback: RCTResponseSenderBlock) {
    let userDefaults = UserDefaults(suiteName: "group.org.reactjs.native.example")
    let isMuteApp = userDefaults?.bool(forKey: "isMuteApp") ?? false
    callback([isMuteApp])
  }
  
  @objc
  func setMuteAppState(_ state: Bool) {
    print("setMuteAppState called with state: \(state)")
    isMuteApp = state
    
    let userDefaults = UserDefaults(suiteName: "group.org.reactjs.native.example")
    userDefaults?.set(state, forKey: "isMuteApp")
    userDefaults?.synchronize()
  }
}
