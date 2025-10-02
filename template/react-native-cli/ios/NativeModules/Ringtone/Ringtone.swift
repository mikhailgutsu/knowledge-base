import Foundation
import React
import AVFoundation

@objc(Ringtone)
class Ringtone: NSObject, RCTBridgeModule {
  static func moduleName() -> String! {
    return "Ringtone"
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return false
  }

  private var ringtone: String = ""
  private let userDefaults = UserDefaults(suiteName: "group.org.reactjs.native.example")
  
  @objc
  func setRingtone(
    _ ringtoneName: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard !ringtoneName.isEmpty else {
      reject("INVALID_ARGUMENT", "Ringtone name cannot be empty", nil)
      return
    }
    
    DispatchQueue.main.async {
      self.userDefaults?.set(ringtoneName, forKey: "ringtone")
      resolve(NSNull())
    }
  }
}
