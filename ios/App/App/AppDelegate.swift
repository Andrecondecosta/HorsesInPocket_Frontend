
import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?
  var bridge: CAPBridgeProtocol?

  private func captureBridgeIfNeeded(_ origin: String) {
    if let rootVC = self.window?.rootViewController as? CAPBridgeViewController {
      if self.bridge == nil {
        self.bridge = rootVC.bridge
      }
    }
  }

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    captureBridgeIfNeeded("didFinishLaunching/immediate")

    DispatchQueue.main.async { [weak self] in
      self?.captureBridgeIfNeeded("didFinishLaunching/async")
    }

    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
      self?.captureBridgeIfNeeded("didFinishLaunching/+0.5s")
    }

    NotificationCenter.default.addObserver(
      forName: UIApplication.userDidTakeScreenshotNotification,
      object: nil, queue: .main
    ) { [weak self] _ in
      self?.bridge?.triggerJSEvent(eventName: "screenshotTaken", target: "window")
      self?.bridge?.webView?.evaluateJavaScript("window.__onCapEvent && window.__onCapEvent('screenshotTaken');")
    }

    NotificationCenter.default.addObserver(
      forName: UIScreen.capturedDidChangeNotification,
      object: nil, queue: .main
    ) { [weak self] _ in
      let captured = UIScreen.main.isCaptured
      let evt = captured ? "screenCapturedStart" : "screenCapturedEnd"
      self?.bridge?.triggerJSEvent(eventName: evt, target: "window")
      self?.bridge?.webView?.evaluateJavaScript("window.__onCapEvent && window.__onCapEvent('\(evt)');")
    }

    return true
  }

  func applicationWillResignActive(_ application: UIApplication) {
  }

  func applicationDidEnterBackground(_ application: UIApplication) {
  }

  func applicationWillEnterForeground(_ application: UIApplication) {
  }

  func applicationDidBecomeActive(_ application: UIApplication) {
  }

  func applicationWillTerminate(_ application: UIApplication) {
  }

  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
  }

  func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }

}
